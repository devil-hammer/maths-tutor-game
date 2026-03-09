"use client";

import Link from "next/link";
import { ReactNode, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

import { PlayerStoreHydrator } from "@/features/profile/player-store-hydrator";
import { usePlayerStore } from "@/features/profile/player-store";
import { MascotCompanion } from "@/components/ui/mascot-companion";
import { SoundToggle } from "@/components/ui/sound-toggle";
import { AuthUser, MascotMood, PersistedPlayerState } from "@/lib/types";

interface AppShellProps {
  currentUser: AuthUser;
  initialPlayerState: PersistedPlayerState;
  children: ReactNode;
}

const navItems = [
  { href: "/", label: "Home" },
  { href: "/play", label: "Play" },
  { href: "/progress", label: "Progress" },
  { href: "/shop", label: "Shop" },
];

export function AppShell({ currentUser, initialPlayerState, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const profile = usePlayerStore((state) => state.profile);
  const activeSession = usePlayerStore((state) => state.activeSession);
  const lastSummary = usePlayerStore((state) => state.lastSummary);
  const mascotMood = usePlayerStore((state) => state.mascotMood);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const currentMood = useMemo<MascotMood>(() => {
    if (mascotMood) {
      return mascotMood;
    }

    if (pathname === "/play" && activeSession) {
      return "encourage";
    }

    if (pathname === "/play" && lastSummary) {
      return "celebrate";
    }

    if (pathname === "/progress") {
      return "encourage";
    }

    return "idle";
  }, [activeSession, lastSummary, mascotMood, pathname]);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await fetch("/api/auth/signout", {
        method: "POST",
      });
    } finally {
      router.push("/login");
      router.refresh();
      setIsSigningOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ede9fe,_#ddd6fe_30%,_#dbeafe_68%,_#ffffff)] text-slate-900">
      <PlayerStoreHydrator progress={initialPlayerState} />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <motion.header
          initial={prefersReducedMotion ? false : { opacity: 0, y: -16 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6 rounded-[2rem] border-4 border-white/80 bg-white/75 px-5 py-4 shadow-[0_18px_60px_rgba(124,58,237,0.16)] backdrop-blur"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">
                Maths Tutor Quest
              </p>
              <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
                Playful maths missions for ages 8 to 10
              </h1>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <div className="rounded-full border-2 border-violet-200 bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700">
                  {currentUser.username}
                </div>
                <SoundToggle />
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-full border-2 border-rose-200 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 transition hover:-translate-y-0.5"
                  disabled={isSigningOut}
                >
                  {isSigningOut ? "Signing Out..." : "Log Out"}
                </button>
              </div>

              <nav className="flex flex-wrap gap-2 lg:justify-end">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5 ${
                      pathname === item.href
                        ? "border-violet-300 bg-violet-500 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-600"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </motion.header>

        <motion.main
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="flex-1"
        >
          {children}
        </motion.main>
      </div>
      <MascotCompanion
        mood={currentMood}
        pathname={pathname}
        profile={profile}
        activeSession={activeSession}
        lastSummary={lastSummary}
      />
    </div>
  );
}
