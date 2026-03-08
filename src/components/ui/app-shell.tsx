"use client";

import Link from "next/link";
import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

import { usePlayerStore } from "@/features/profile/player-store";
import { MascotCompanion } from "@/components/ui/mascot-companion";
import { SoundToggle } from "@/components/ui/sound-toggle";
import { MascotMood } from "@/lib/types";

interface AppShellProps {
  children: ReactNode;
}

const navItems = [
  { href: "/", label: "Home" },
  { href: "/play", label: "Play" },
  { href: "/progress", label: "Progress" },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const activeSession = usePlayerStore((state) => state.activeSession);
  const lastSummary = usePlayerStore((state) => state.lastSummary);
  const mascotMood = usePlayerStore((state) => state.mascotMood);

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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fef3c7,_#fde68a_35%,_#dbeafe_75%,_#ffffff)] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <motion.header
          initial={prefersReducedMotion ? false : { opacity: 0, y: -16 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6 rounded-[2rem] border-4 border-white/80 bg-white/75 px-5 py-4 shadow-[0_18px_60px_rgba(59,130,246,0.18)] backdrop-blur"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">
                Maths Tutor Quest
              </p>
              <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
                Playful maths missions for ages 8 to 10
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <SoundToggle />
              <nav className="flex flex-wrap gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border-2 border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-600"
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
      <MascotCompanion mood={currentMood} />
    </div>
  );
}
