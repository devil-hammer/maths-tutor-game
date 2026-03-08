import { AppShell } from "@/components/ui/app-shell";
import { ProgressPageClient } from "@/features/progression/progress-page-client";

export default function ProgressPage() {
  return (
    <AppShell>
      <ProgressPageClient />
    </AppShell>
  );
}
