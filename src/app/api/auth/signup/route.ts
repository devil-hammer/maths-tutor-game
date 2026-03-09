import { NextResponse } from "next/server";

import { createInitialPlayerState } from "@/lib/player-state";
import { createSessionForUser, getSessionCookieOptions, registerUserAccount } from "@/lib/server/auth";
import { saveUserProgress } from "@/lib/server/progress";

export async function POST(request: Request) {
  try {
    const { username, password } = (await request.json()) as {
      username?: string;
      password?: string;
    };

    const user = await registerUserAccount(username ?? "", password ?? "");
    await saveUserProgress(user.id, createInitialPlayerState(user.username));
    const session = await createSessionForUser(user.id);
    const response = NextResponse.json({ user });

    response.cookies.set(
      "maths_tutor_session",
      session.sessionToken,
      getSessionCookieOptions(session.expiresAt),
    );

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create account.";
    const status = typeof error === "object" && error && "status" in error ? Number(error.status) : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
