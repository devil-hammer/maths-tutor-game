import { NextResponse } from "next/server";

import { authenticateUserAccount, createSessionForUser, getSessionCookieOptions, SESSION_COOKIE_NAME } from "@/lib/server/auth";
import { getOrCreateUserProgress } from "@/lib/server/progress";

export async function POST(request: Request) {
  try {
    const { username, password } = (await request.json()) as {
      username?: string;
      password?: string;
    };

    const user = await authenticateUserAccount(username ?? "", password ?? "");
    await getOrCreateUserProgress(user);

    const session = await createSessionForUser(user.id);
    const response = NextResponse.json({ user });

    response.cookies.set(
      SESSION_COOKIE_NAME,
      session.sessionToken,
      getSessionCookieOptions(session.expiresAt),
    );

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sign in.";
    const status = typeof error === "object" && error && "status" in error ? Number(error.status) : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
