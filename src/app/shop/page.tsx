import { AppShell } from "@/components/ui/app-shell";
import { ShopPageClient } from "@/features/shop/shop-page-client";
import { getProtectedPageData } from "@/lib/server/protected-page";

export default async function ShopPage() {
  const { user, progress } = await getProtectedPageData();

  return (
    <AppShell currentUser={user} initialPlayerState={progress}>
      <ShopPageClient />
    </AppShell>
  );
}
