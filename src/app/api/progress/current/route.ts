import { NextResponse } from "next/server";

import { normalizePersistedPlayerState } from "@/lib/player-state";
import { getUserFromSessionToken, SESSION_COOKIE_NAME } from "@/lib/server/auth";
import { getOrCreateUserProgress, saveUserProgress } from "@/lib/server/progress";

function getSessionToken(request: Request) {
  return request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.slice(SESSION_COOKIE_NAME.length + 1);
}

export async function GET(request: Request) {
  const user = await getUserFromSessionToken(getSessionToken(request));

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const progress = await getOrCreateUserProgress(user);

  return NextResponse.json({ progress });
}

export async function PUT(request: Request) {
  const user = await getUserFromSessionToken(getSessionToken(request));

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { progress?: unknown };
    const progress = normalizePersistedPlayerState(body.progress, user.username);
    await saveUserProgress(user.id, progress);

    return NextResponse.json({ progress });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save progress.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
