"use client";

import { useMemo, useState } from "react";

import { mascots, novaShopItems, novaSlotLabels, orbitShopItems, orbitSlotLabels } from "@/lib/content";
import { ProgressBar } from "@/components/ui/progress-bar";
import { usePlayerStore } from "@/features/profile/player-store";
import {
  MascotId,
  NovaCosmeticSlot,
  NovaItemId,
  NovaShopItem,
  OrbitCosmeticSlot,
  OrbitItemId,
  OrbitShopItem,
} from "@/lib/types";

const slotOrder: NovaCosmeticSlot[] = ["mane", "horn", "accessory", "trail"];
const orbitSlotOrder: OrbitCosmeticSlot[] = ["wings", "horns", "accessory", "trail"];

export function ShopPageClient() {
  const profile = usePlayerStore((state) => state.profile);
  const isHydrated = usePlayerStore((state) => state.isHydrated);
  const isSaving = usePlayerStore((state) => state.isSaving);
  const saveError = usePlayerStore((state) => state.saveError);
  const buyNovaItem = usePlayerStore((state) => state.buyNovaItem);
  const equipNovaItem = usePlayerStore((state) => state.equipNovaItem);
  const buyOrbitItem = usePlayerStore((state) => state.buyOrbitItem);
  const equipOrbitItem = usePlayerStore((state) => state.equipOrbitItem);
  const setActiveMascot = usePlayerStore((state) => state.setActiveMascot);
  const [pendingItemId, setPendingItemId] = useState<NovaItemId | OrbitItemId | null>(null);
  const [pendingMascotId, setPendingMascotId] = useState<MascotId | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const groupedItems = useMemo(
    () =>
      slotOrder.map((slot) => ({
        slot,
        items: novaShopItems.filter((item) => item.slot === slot),
      })),
    [],
  );
  const groupedOrbitItems = useMemo(
    () =>
      orbitSlotOrder.map((slot) => ({
        slot,
        items: orbitShopItems.filter((item) => item.slot === slot),
      })),
    [],
  );

  async function handleAction(itemId: NovaItemId, isOwned: boolean) {
    setPendingItemId(itemId);
    setActionError(null);

    try {
      if (isOwned) {
        await equipNovaItem(itemId);
      } else {
        await buyNovaItem(itemId);
      }
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to update Nova's style.");
    } finally {
      setPendingItemId(null);
    }
  }

  async function handleMascotSwitch(mascotId: MascotId) {
    setPendingMascotId(mascotId);
    setActionError(null);

    try {
      await setActiveMascot(mascotId);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to switch mascot.");
    } finally {
      setPendingMascotId(null);
    }
  }

  async function handleOrbitAction(itemId: OrbitItemId, isOwned: boolean) {
    setPendingItemId(itemId);
    setActionError(null);

    try {
      if (isOwned) {
        await equipOrbitItem(itemId);
      } else {
        await buyOrbitItem(itemId);
      }
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to update Orbit's style.");
    } finally {
      setPendingItemId(null);
    }
  }

  if (!isHydrated) {
    return (
      <div className="rounded-[2rem] bg-white/90 p-8 text-center text-lg font-semibold text-slate-600 shadow-xl">
        Loading Nova&apos;s shop...
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {saveError ? (
        <section className="rounded-[1.75rem] border-2 border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
          {saveError}
        </section>
      ) : null}

      {actionError ? (
        <section className="rounded-[1.75rem] border-2 border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
          {actionError}
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2.5rem] border-4 border-white bg-white/90 p-6 shadow-xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-500">Mascot Shop</p>
          <h2 className="mt-2 text-4xl font-black text-slate-900">Build your mascot team</h2>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
            Coins buy fun cosmetic upgrades, while stars unlock rare styles and new mascot friends. Nothing
            changes gameplay, but your guides become more magical as each child progresses.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <BalanceCard label="Coins" value={profile.coins.toString()} tone="sky" />
          <BalanceCard label="Stars" value={profile.stars.toString()} tone="violet" />
        </div>
      </section>

      <section className="rounded-[2.5rem] border-4 border-white bg-white/90 p-6 shadow-[0_18px_60px_rgba(124,58,237,0.12)]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-500">Mascot Friends</p>
            <h3 className="text-2xl font-black text-slate-900">Choose who floats beside you</h3>
          </div>
          <div className="rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700">
            {profile.ownedMascots.length}/{mascots.length} unlocked
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {mascots.map((mascot) => {
            const isOwned = profile.ownedMascots.includes(mascot.id);
            const isActive = profile.activeMascotId === mascot.id;
            const remainingStars = Math.max(0, mascot.requiredStars - profile.stars);
            const progress = mascot.requiredStars === 0 ? 100 : (profile.stars / mascot.requiredStars) * 100;

            return (
              <article key={mascot.id} className="rounded-[2rem] bg-slate-100 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-500">
                      {mascot.id === "nova" ? "Starter Guide" : "Unlockable Friend"}
                    </p>
                    <h4 className="mt-1 text-2xl font-black text-slate-900">{mascot.name}</h4>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                    {isActive ? "Active" : isOwned ? "Unlocked" : "Locked"}
                  </div>
                </div>

                <div className="mt-4 rounded-[1.5rem] bg-gradient-to-br from-violet-100 via-white to-sky-100 px-4 py-5 text-center">
                  <div className="text-4xl" aria-hidden="true">
                    {mascot.id === "nova" ? "🦄" : "🐉"}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{mascot.description}</p>
                </div>

                {isOwned ? (
                  <p className="mt-4 text-sm font-semibold text-violet-700">
                    {isActive ? `${mascot.name} is guiding you right now.` : `Switch to ${mascot.name} anytime.`}
                  </p>
                ) : (
                  <>
                    <div className="mt-4">
                      <ProgressBar value={Math.min(progress, 100)} label={`${profile.stars}/${mascot.requiredStars} stars`} />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-sky-700">
                      Earn {remainingStars} more star{remainingStars === 1 ? "" : "s"} to unlock {mascot.name}.
                    </p>
                  </>
                )}

                <button
                  type="button"
                  disabled={!isOwned || isActive || isSaving || pendingMascotId === mascot.id}
                  onClick={() => void handleMascotSwitch(mascot.id)}
                  className={`mt-5 w-full rounded-full px-5 py-3 text-sm font-black text-white transition ${
                    isActive
                      ? "bg-slate-300"
                      : isOwned
                        ? "bg-violet-500 hover:-translate-y-0.5"
                        : "bg-slate-300"
                  } disabled:cursor-not-allowed disabled:opacity-70`}
                >
                  {pendingMascotId === mascot.id ? "Switching..." : isActive ? "Active Mascot" : isOwned ? `Switch to ${mascot.name}` : `Unlock at ${mascot.requiredStars} stars`}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {groupedItems.map(({ slot, items }) => (
        <section
          key={slot}
          className="rounded-[2.5rem] border-4 border-white bg-white/90 p-6 shadow-[0_18px_60px_rgba(124,58,237,0.12)]"
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">{novaSlotLabels[slot]}</p>
              <h3 className="text-2xl font-black text-slate-900">
                Equipped on Nova: {items.find((item) => item.id === profile.equippedNovaItems[slot])?.title}
              </h3>
            </div>
            <div className="rounded-full bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700">
              {items.filter((item) => profile.ownedNovaItems.includes(item.id)).length}/{items.length} owned
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {items.map((item) => {
              const isOwned = profile.ownedNovaItems.includes(item.id);
              const isEquipped = profile.equippedNovaItems[slot] === item.id;
              const canUnlock = profile.stars >= item.requiredStars;
              const canAfford = profile.coins >= item.costCoins;
              const isPending = pendingItemId === item.id;
              const actionDisabled =
                isSaving || isPending || isEquipped || (!isOwned && (!canUnlock || !canAfford));
              const actionLabel = isEquipped
                ? "Equipped"
                : isOwned
                  ? "Equip"
                  : item.costCoins === 0
                    ? "Unlock"
                    : `Buy for ${item.costCoins} coins`;

              return (
                <article key={item.id} className="rounded-[2rem] bg-slate-100 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-500">{item.preview}</p>
                      <h4 className="mt-1 text-2xl font-black text-slate-900">{item.title}</h4>
                    </div>
                    <div className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                      {isEquipped ? "On Nova" : isOwned ? "Owned" : "Shop"}
                    </div>
                  </div>

                  <div className="mt-4">
                    <ShopItemPreview item={item} />
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
                    <span className="rounded-full bg-white px-3 py-2 text-sky-700">{item.costCoins} coins</span>
                    <span className="rounded-full bg-white px-3 py-2 text-violet-700">{item.requiredStars} stars</span>
                  </div>

                  {!isOwned && !canUnlock ? (
                    <p className="mt-4 text-sm font-semibold text-violet-700">
                      Earn {item.requiredStars - profile.stars} more stars to unlock this style.
                    </p>
                  ) : null}

                  {!isOwned && canUnlock && !canAfford ? (
                    <p className="mt-4 text-sm font-semibold text-sky-700">
                      Earn {item.costCoins - profile.coins} more coins to buy this style.
                    </p>
                  ) : null}

                  <button
                    type="button"
                    disabled={actionDisabled}
                    onClick={() => void handleAction(item.id, isOwned)}
                    className={`mt-5 w-full rounded-full px-5 py-3 text-sm font-black text-white transition ${
                      isEquipped
                        ? "bg-slate-300"
                        : isOwned
                          ? "bg-violet-500 hover:-translate-y-0.5"
                          : "bg-gradient-to-r from-sky-500 to-violet-500 hover:-translate-y-0.5"
                    } disabled:cursor-not-allowed disabled:opacity-70`}
                  >
                    {isPending ? "Saving..." : actionLabel}
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      {groupedOrbitItems.map(({ slot, items }) => (
        <section
          key={slot}
          className="rounded-[2.5rem] border-4 border-white bg-white/90 p-6 shadow-[0_18px_60px_rgba(14,165,233,0.12)]"
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">{orbitSlotLabels[slot]}</p>
              <h3 className="text-2xl font-black text-slate-900">
                Equipped on Orbit: {items.find((item) => item.id === profile.equippedOrbitItems[slot])?.title}
              </h3>
            </div>
            <div className="rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700">
              {items.filter((item) => profile.ownedOrbitItems.includes(item.id)).length}/{items.length} owned
            </div>
          </div>

          {!profile.ownedMascots.includes("orbit") ? (
            <div className="rounded-[1.75rem] border-2 border-violet-200 bg-violet-50 px-5 py-4 text-sm font-semibold text-violet-700">
              Unlock Orbit first to buy and equip dragon cosmetics.
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-3">
              {items.map((item) => {
                const isOwned = profile.ownedOrbitItems.includes(item.id);
                const isEquipped = profile.equippedOrbitItems[slot] === item.id;
                const canUnlock = profile.stars >= item.requiredStars;
                const canAfford = profile.coins >= item.costCoins;
                const isPending = pendingItemId === item.id;
                const actionDisabled =
                  isSaving || isPending || isEquipped || (!isOwned && (!canUnlock || !canAfford));
                const actionLabel = isEquipped
                  ? "Equipped"
                  : isOwned
                    ? "Equip"
                    : item.costCoins === 0
                      ? "Unlock"
                      : `Buy for ${item.costCoins} coins`;

                return (
                  <article key={item.id} className="rounded-[2rem] bg-slate-100 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">{item.preview}</p>
                        <h4 className="mt-1 text-2xl font-black text-slate-900">{item.title}</h4>
                      </div>
                      <div className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                        {isEquipped ? "On Orbit" : isOwned ? "Owned" : "Shop"}
                      </div>
                    </div>

                    <div className="mt-4">
                      <OrbitItemPreview item={item} />
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>

                    <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
                      <span className="rounded-full bg-white px-3 py-2 text-sky-700">{item.costCoins} coins</span>
                      <span className="rounded-full bg-white px-3 py-2 text-violet-700">{item.requiredStars} stars</span>
                    </div>

                    {!isOwned && !canUnlock ? (
                      <p className="mt-4 text-sm font-semibold text-violet-700">
                        Earn {item.requiredStars - profile.stars} more stars to unlock this style.
                      </p>
                    ) : null}

                    {!isOwned && canUnlock && !canAfford ? (
                      <p className="mt-4 text-sm font-semibold text-sky-700">
                        Earn {item.costCoins - profile.coins} more coins to buy this style.
                      </p>
                    ) : null}

                    <button
                      type="button"
                      disabled={actionDisabled}
                      onClick={() => void handleOrbitAction(item.id, isOwned)}
                      className={`mt-5 w-full rounded-full px-5 py-3 text-sm font-black text-white transition ${
                        isEquipped
                          ? "bg-slate-300"
                          : isOwned
                            ? "bg-sky-500 hover:-translate-y-0.5"
                            : "bg-gradient-to-r from-violet-500 to-sky-500 hover:-translate-y-0.5"
                      } disabled:cursor-not-allowed disabled:opacity-70`}
                    >
                      {isPending ? "Saving..." : actionLabel}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

function ShopItemPreview({ item }: { item: NovaShopItem }) {
  return (
    <div className="relative h-28 overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-violet-100 via-white to-sky-100">
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/85 to-transparent" />

      {item.slot === "mane" ? (
        <div className="absolute inset-0">
          {item.id === "mane-classic" ? (
            <>
              <div className="absolute left-8 top-8 h-9 w-8 rounded-full bg-violet-300/90" />
              <div className="absolute left-12 top-5 h-9 w-8 rounded-full bg-fuchsia-300/85" />
              <div className="absolute right-10 top-8 h-8 w-7 rounded-full bg-sky-200/90" />
            </>
          ) : null}

          {item.id === "mane-rainbow" ? (
            <>
              <div className="absolute left-8 top-9 h-8 w-8 rounded-full bg-rose-300/90" />
              <div className="absolute left-12 top-5 h-9 w-8 rounded-full bg-amber-200/95" />
              <div className="absolute right-12 top-7 h-8 w-7 rounded-full bg-emerald-300/90" />
              <div className="absolute right-8 top-4 h-9 w-7 rounded-full bg-sky-300/90" />
            </>
          ) : null}

          {item.id === "mane-comet" ? (
            <>
              <div className="absolute left-8 top-9 h-8 w-8 rounded-full bg-slate-800/90" />
              <div className="absolute left-12 top-5 h-9 w-8 rounded-full bg-violet-400/90" />
              <div className="absolute right-12 top-7 h-8 w-7 rounded-full bg-fuchsia-300/90" />
              <div className="absolute right-8 top-4 h-9 w-7 rounded-full bg-sky-200/90" />
              <div className="absolute right-6 top-3 h-2 w-2 rounded-full bg-white/90" />
            </>
          ) : null}
        </div>
      ) : null}

      {item.slot === "horn" ? (
        <div className="absolute inset-0">
          <div className="absolute bottom-5 left-1/2 h-11 w-11 -translate-x-1/2 rounded-full bg-white shadow-sm" />
          <div
            className={`absolute left-1/2 top-4 h-12 w-4 -translate-x-1/2 -rotate-[8deg] rounded-full ${
              item.id === "horn-crystal"
                ? "bg-gradient-to-b from-cyan-100 via-sky-100 to-violet-200"
                : item.id === "horn-sunbeam"
                  ? "bg-gradient-to-b from-yellow-100 via-amber-200 to-orange-200"
                  : "bg-gradient-to-b from-amber-100 via-yellow-200 to-violet-100"
            }`}
          />
        </div>
      ) : null}

      {item.slot === "accessory" ? (
        <div className="absolute inset-0">
          <div className="absolute bottom-5 left-1/2 h-11 w-11 -translate-x-1/2 rounded-full bg-white shadow-sm" />
          {item.id === "accessory-none" ? (
            <div className="absolute inset-x-0 top-8 text-center text-sm font-bold text-slate-400">Simple look</div>
          ) : null}
          {item.id === "accessory-crown" ? (
            <>
              <div className="absolute left-1/2 top-6 h-3 w-10 -translate-x-1/2 rounded-full bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-200" />
              <div className="absolute left-[2.7rem] top-[1.2rem] h-4 w-4 rounded-t-full bg-yellow-200" />
              <div className="absolute left-1/2 top-[0.8rem] h-4 w-4 -translate-x-1/2 rounded-t-full bg-amber-300" />
              <div className="absolute right-[2.7rem] top-[1.2rem] h-4 w-4 rounded-t-full bg-yellow-200" />
            </>
          ) : null}
          {item.id === "accessory-glasses" ? (
            <>
              <div className="absolute left-[2.75rem] top-10 h-5 w-5 rounded-full border-2 border-fuchsia-400 bg-white/70" />
              <div className="absolute right-[2.75rem] top-10 h-5 w-5 rounded-full border-2 border-fuchsia-400 bg-white/70" />
              <div className="absolute left-1/2 top-[2.95rem] h-0.5 w-3 -translate-x-1/2 bg-fuchsia-400" />
            </>
          ) : null}
        </div>
      ) : null}

      {item.slot === "trail" ? (
        <div className="absolute inset-0">
          <div className="absolute right-7 top-6 h-12 w-12 rounded-full bg-white shadow-sm" />
          {item.id === "trail-none" ? (
            <div className="absolute left-6 top-10 text-sm font-bold text-slate-400">No extra trail</div>
          ) : null}
          {item.id === "trail-stardust" ? (
            <>
              <div className="absolute left-7 top-8 h-2.5 w-2.5 rounded-full bg-white/95" />
              <div className="absolute left-11 top-5 h-2 w-2 rounded-full bg-fuchsia-300/95" />
              <div className="absolute left-14 top-10 h-2.5 w-2.5 rounded-full bg-sky-300/95" />
              <div className="absolute left-18 top-6 h-1.5 w-1.5 rounded-full bg-violet-300/95" />
            </>
          ) : null}
          {item.id === "trail-cloud" ? (
            <>
              <div className="absolute left-6 top-9 h-5 w-5 rounded-full bg-white/85" />
              <div className="absolute left-10 top-7 h-6 w-6 rounded-full bg-white/85" />
              <div className="absolute left-15 top-9 h-5 w-5 rounded-full bg-white/80" />
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function OrbitItemPreview({ item }: { item: OrbitShopItem }) {
  return (
    <div className="relative h-28 overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-sky-100 via-white to-violet-100">
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/85 to-transparent" />
      <div className="absolute left-5 top-4 h-5 w-5 rounded-full bg-white/50 blur-[1px]" />
      <div className="absolute right-4 top-5 h-6 w-6 rounded-full bg-fuchsia-200/55 blur-[2px]" />
      <div className="absolute left-1/2 top-7 h-12 w-12 -translate-x-1/2 rounded-full bg-violet-700 shadow-sm" />
      <div className="absolute left-1/2 top-11 h-8 w-9 -translate-x-1/2 rounded-[45%] bg-violet-100" />
      <div className="absolute left-[3rem] top-[2.65rem] h-2.5 w-2.5 rounded-full bg-white" />
      <div className="absolute right-[3rem] top-[2.65rem] h-2.5 w-2.5 rounded-full bg-white" />
      <div className="absolute left-[3.12rem] top-[2.78rem] h-1 w-1 rounded-full bg-slate-900" />
      <div className="absolute right-[3.12rem] top-[2.78rem] h-1 w-1 rounded-full bg-slate-900" />
      <div className="absolute left-1/2 top-[3.9rem] h-2 w-3 -translate-x-1/2 rounded-full bg-violet-300" />

      {item.slot === "wings" ? (
        <div className="absolute inset-0">
          <div
            className={`absolute left-4 top-7 h-11 w-9 rotate-[-18deg] rounded-[1.6rem] ${
              item.id === "wings-comet"
                ? "bg-gradient-to-br from-sky-300 to-cyan-500"
                : item.id === "wings-nebula"
                  ? "bg-gradient-to-br from-indigo-700 to-fuchsia-400"
                  : "bg-gradient-to-br from-violet-400 to-fuchsia-300"
            }`}
          />
          <div
            className={`absolute right-4 top-7 h-11 w-9 rotate-[18deg] rounded-[1.6rem] ${
              item.id === "wings-comet"
                ? "bg-gradient-to-br from-sky-300 to-cyan-500"
                : item.id === "wings-nebula"
                  ? "bg-gradient-to-br from-indigo-700 to-fuchsia-400"
                  : "bg-gradient-to-br from-violet-400 to-fuchsia-300"
            }`}
          />
          {item.id === "wings-nebula" ? (
            <>
              <div className="absolute left-6 top-8 h-1.5 w-1.5 rounded-full bg-white/90" />
              <div className="absolute right-7 top-9 h-1.5 w-1.5 rounded-full bg-sky-100/90" />
            </>
          ) : null}
        </div>
      ) : null}

      {item.slot === "horns" ? (
        <div className="absolute inset-0">
          <div
            className={`absolute left-[2.7rem] top-5 h-7 w-2 rotate-[-24deg] rounded-full ${
              item.id === "horns-crystal"
                ? "bg-gradient-to-b from-cyan-100 to-violet-300"
                : item.id === "horns-sunflare"
                  ? "bg-gradient-to-b from-yellow-100 to-orange-300"
                  : "bg-gradient-to-b from-fuchsia-200 to-violet-300"
            }`}
          />
          <div
            className={`absolute right-[2.7rem] top-5 h-7 w-2 rotate-[24deg] rounded-full ${
              item.id === "horns-crystal"
                ? "bg-gradient-to-b from-cyan-100 to-violet-300"
                : item.id === "horns-sunflare"
                  ? "bg-gradient-to-b from-yellow-100 to-orange-300"
                  : "bg-gradient-to-b from-fuchsia-200 to-violet-300"
            }`}
          />
        </div>
      ) : null}

      {item.slot === "accessory" ? (
        <div className="absolute inset-0">
          {item.id === "orbit-accessory-none" ? (
            <div className="absolute inset-x-0 top-8 text-center text-sm font-bold text-slate-400">Simple look</div>
          ) : null}
          {item.id === "orbit-accessory-cape" ? (
            <div className="absolute left-1/2 top-[3.1rem] h-9 w-8 -translate-x-1/2 rounded-b-[1rem] bg-gradient-to-b from-rose-400 to-fuchsia-600" />
          ) : null}
          {item.id === "orbit-accessory-bandana" ? (
            <>
              <div className="absolute left-1/2 top-[3rem] h-3 w-10 -translate-x-1/2 rounded-full bg-sky-500" />
              <div className="absolute left-[3.15rem] top-[2.9rem] h-4 w-2 rotate-[-20deg] rounded-full bg-sky-500" />
              <div className="absolute right-[3.15rem] top-[2.9rem] h-4 w-2 rotate-[20deg] rounded-full bg-sky-500" />
            </>
          ) : null}
        </div>
      ) : null}

      {item.slot === "trail" ? (
        <div className="absolute inset-0">
          {item.id === "orbit-trail-none" ? (
            <div className="absolute left-6 top-10 text-sm font-bold text-slate-400">No extra trail</div>
          ) : null}
          {item.id === "orbit-trail-embers" ? (
            <>
              <div className="absolute left-5 top-8 h-3 w-3 rounded-full bg-amber-300" />
              <div className="absolute left-9 top-5 h-2.5 w-2.5 rounded-full bg-orange-400" />
              <div className="absolute left-13 top-10 h-3 w-3 rounded-full bg-rose-400" />
              <div className="absolute left-17 top-7 h-2 w-2 rounded-full bg-yellow-200" />
            </>
          ) : null}
          {item.id === "orbit-trail-moons" ? (
            <>
              <div className="absolute left-5 top-9 h-4 w-4 rounded-full border-2 border-violet-300" />
              <div className="absolute left-9 top-6 h-3 w-3 rounded-full border-2 border-sky-300" />
              <div className="absolute left-13 top-10 h-4 w-4 rounded-full border-2 border-fuchsia-300" />
              <div className="absolute left-18 top-7 h-2 w-2 rounded-full bg-white/90" />
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function BalanceCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "sky" | "violet";
}) {
  const toneClasses = {
    sky: "from-sky-500 to-cyan-500",
    violet: "from-violet-500 to-fuchsia-500",
  };

  return (
    <div className={`rounded-[2rem] bg-gradient-to-br ${toneClasses[tone]} px-6 py-5 text-white shadow-xl`}>
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">{label}</p>
      <p className="mt-2 text-5xl font-black">{value}</p>
    </div>
  );
}
