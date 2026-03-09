import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getUserFromSessionToken, SESSION_COOKIE_NAME } from "@/lib/server/auth";
import { getOrCreateUserProgress } from "@/lib/server/progress";

export async function getOptionalAuthenticatedUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  return getUserFromSessionToken(sessionToken);
}

export async function getProtectedPageData() {
  const user = await getOptionalAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  const progress = await getOrCreateUserProgress(user);

  return {
    user,
    progress,
  };
}
