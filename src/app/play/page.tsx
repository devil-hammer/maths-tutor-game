import { Suspense } from "react";

import { AppShell } from "@/components/ui/app-shell";
import { PlayPageClient } from "@/features/practice/play-page-client";
import { getProtectedPageData } from "@/lib/server/protected-page";

export default async function PlayPage() {
  const { user, progress } = await getProtectedPageData();

  return (
    <AppShell currentUser={user} initialPlayerState={progress}>
      <Suspense
        fallback={
          <div className="rounded-[2rem] bg-white/90 p-8 text-center text-lg font-semibold text-slate-600 shadow-xl">
            Loading your mission...
          </div>
        }
      >
        <PlayPageClient />
      </Suspense>
    </AppShell>
  );
}
