import { redirect } from "next/navigation";

import { AuthPage } from "@/features/auth/auth-page";
import { isSupabaseConfigured } from "@/lib/env";
import { getOptionalAuthenticatedUser } from "@/lib/server/protected-page";

export default async function SignupPage() {
  const user = await getOptionalAuthenticatedUser();

  if (user) {
    redirect("/");
  }

  return <AuthPage mode="signup" configured={isSupabaseConfigured()} />;
}
