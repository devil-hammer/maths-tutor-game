import "server-only";

import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

import { AuthUser } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 72;
const USERNAME_PATTERN = /^[A-Za-z0-9_-]{3,24}$/;

export const SESSION_COOKIE_NAME = "maths_tutor_session";
export const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30;

interface AppUserRow {
  id: string;
  username: string;
  username_normalized: string;
  password_hash: string;
  created_at: string;
}

interface AppSessionRow {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: string;
}

export class AuthApiError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
  }
}

export function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

export function validateUsername(username: string) {
  const trimmed = username.trim();

  if (!USERNAME_PATTERN.test(trimmed)) {
    throw new AuthApiError(
      "Usernames must be 3 to 24 characters and use only letters, numbers, dashes, or underscores.",
    );
  }

  return trimmed;
}

export function validatePassword(password: string) {
  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new AuthApiError(`Passwords must be at least ${PASSWORD_MIN_LENGTH} characters long.`);
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    throw new AuthApiError(`Passwords must be ${PASSWORD_MAX_LENGTH} characters or fewer.`);
  }

  return password;
}

function mapUser(row: Pick<AppUserRow, "id" | "username" | "created_at">): AuthUser {
  return {
    id: row.id,
    username: row.username,
    createdAt: row.created_at,
  };
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `scrypt$${salt}$${hash}`;
}

function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, expectedHash] = storedHash.split("$");

  if (algorithm !== "scrypt" || !salt || !expectedHash) {
    return false;
  }

  const actualHash = scryptSync(password, salt, 64);
  const expectedBuffer = Buffer.from(expectedHash, "hex");

  if (actualHash.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualHash, expectedBuffer);
}

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createSessionCookieValue() {
  return randomBytes(32).toString("base64url");
}

export function getSessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  };
}

export async function createSessionForUser(userId: string) {
  const supabase = createSupabaseServerClient();
  const sessionToken = createSessionCookieValue();
  const tokenHash = hashSessionToken(sessionToken);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const { error } = await supabase.from("app_sessions").insert({
    user_id: userId,
    token_hash: tokenHash,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    throw new Error(`Unable to create session: ${error.message}`);
  }

  return {
    sessionToken,
    expiresAt,
  };
}

export async function deleteSessionByToken(sessionToken: string) {
  const supabase = createSupabaseServerClient();
  const tokenHash = hashSessionToken(sessionToken);

  await supabase.from("app_sessions").delete().eq("token_hash", tokenHash);
}

export async function getUserFromSessionToken(sessionToken: string | undefined | null) {
  if (!sessionToken) {
    return null;
  }

  const supabase = createSupabaseServerClient();
  const tokenHash = hashSessionToken(sessionToken);
  const { data: sessionRow, error: sessionError } = await supabase
    .from("app_sessions")
    .select("id, user_id, token_hash, expires_at")
    .eq("token_hash", tokenHash)
    .maybeSingle<AppSessionRow>();

  if (sessionError) {
    throw new Error(`Unable to load session: ${sessionError.message}`);
  }

  if (!sessionRow) {
    return null;
  }

  if (new Date(sessionRow.expires_at).getTime() <= Date.now()) {
    await deleteSessionByToken(sessionToken);
    return null;
  }

  const { data: userRow, error: userError } = await supabase
    .from("app_users")
    .select("id, username, created_at")
    .eq("id", sessionRow.user_id)
    .maybeSingle<Pick<AppUserRow, "id" | "username" | "created_at">>();

  if (userError) {
    throw new Error(`Unable to load user: ${userError.message}`);
  }

  if (!userRow) {
    return null;
  }

  return mapUser(userRow);
}

export async function registerUserAccount(username: string, password: string) {
  const validatedUsername = validateUsername(username);
  const normalizedUsername = normalizeUsername(validatedUsername);
  const validatedPassword = validatePassword(password);
  const passwordHash = hashPassword(validatedPassword);
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("app_users")
    .insert({
      username: validatedUsername,
      username_normalized: normalizedUsername,
      password_hash: passwordHash,
    })
    .select("id, username, created_at")
    .single<Pick<AppUserRow, "id" | "username" | "created_at">>();

  if (error) {
    if (error.code === "23505") {
      throw new AuthApiError("That username is already taken.", 409);
    }

    throw new Error(`Unable to create account: ${error.message}`);
  }

  return mapUser(data);
}

export async function authenticateUserAccount(username: string, password: string) {
  const validatedUsername = validateUsername(username);
  const normalizedUsername = normalizeUsername(validatedUsername);
  const validatedPassword = validatePassword(password);
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("app_users")
    .select("id, username, username_normalized, password_hash, created_at")
    .eq("username_normalized", normalizedUsername)
    .maybeSingle<AppUserRow>();

  if (error) {
    throw new Error(`Unable to sign in: ${error.message}`);
  }

  if (!data || !verifyPassword(validatedPassword, data.password_hash)) {
    throw new AuthApiError("Incorrect username or password.", 401);
  }

  return mapUser(data);
}
