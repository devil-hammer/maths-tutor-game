import { NextResponse } from "next/server";

import { deleteSessionByToken, getSessionCookieOptions, SESSION_COOKIE_NAME } from "@/lib/server/auth";

export async function POST(request: Request) {
  const sessionToken = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.slice(SESSION_COOKIE_NAME.length + 1);

  if (sessionToken) {
    await deleteSessionByToken(sessionToken);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", getSessionCookieOptions(new Date(0)));

  return response;
}
