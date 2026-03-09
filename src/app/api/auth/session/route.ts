import { NextResponse } from "next/server";

import { getUserFromSessionToken, SESSION_COOKIE_NAME } from "@/lib/server/auth";

export async function GET(request: Request) {
  const sessionToken = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.slice(SESSION_COOKIE_NAME.length + 1);

  const user = await getUserFromSessionToken(sessionToken);

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}
