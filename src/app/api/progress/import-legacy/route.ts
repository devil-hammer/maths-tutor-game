import { NextResponse } from "next/server";

import { normalizePersistedPlayerState } from "@/lib/player-state";
import { getUserFromSessionToken, SESSION_COOKIE_NAME } from "@/lib/server/auth";
import { importLegacyUserProgress } from "@/lib/server/progress";

function getSessionToken(request: Request) {
  return request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.slice(SESSION_COOKIE_NAME.length + 1);
}

export async function POST(request: Request) {
  const user = await getUserFromSessionToken(getSessionToken(request));

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { progress?: unknown };
    const progress = normalizePersistedPlayerState(body.progress, user.username);
    const importedProgress = await importLegacyUserProgress(user, progress);

    return NextResponse.json({ progress: importedProgress });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to import progress.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
