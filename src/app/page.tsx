import { AppShell } from "@/components/ui/app-shell";
import { HomePage } from "@/features/home/home-page";
import { getProtectedPageData } from "@/lib/server/protected-page";

export default async function Page() {
  const { user, progress } = await getProtectedPageData();

  return (
    <AppShell currentUser={user} initialPlayerState={progress}>
      <HomePage />
    </AppShell>
  );
}
