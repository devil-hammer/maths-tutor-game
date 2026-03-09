"use client";

import { motion, useReducedMotion } from "framer-motion";

import { usePlayerStore } from "@/features/profile/player-store";
import { MascotMood } from "@/lib/types";

interface MascotCompanionProps {
  mood: MascotMood;
}

const moodCopy: Record<MascotMood, { title: string; subtitle: string; accent: string }> = {
  idle: {
    title: "Nova is ready",
    subtitle: "Your helper is here for the next maths adventure.",
    accent: "from-sky-400 to-violet-500",
  },
  encourage: {
    title: "You can do it",
    subtitle: "Keep going. Fast thinking and brave tries both count.",
    accent: "from-emerald-400 to-sky-500",
  },
  support: {
    title: "Nice try",
    subtitle: "Every mistake helps your brain grow stronger.",
    accent: "from-violet-400 to-fuchsia-500",
  },
  celebrate: {
    title: "Amazing work",
    subtitle: "That mission was packed with stars and progress.",
    accent: "from-fuchsia-400 to-violet-500",
  },
};

export function MascotCompanion({ mood }: MascotCompanionProps) {
  const prefersReducedMotion = useReducedMotion();
  const copy = moodCopy[mood];
  const equippedNovaItems = usePlayerStore((state) => state.profile.equippedNovaItems);
  const mouthClass =
    mood === "support"
      ? "h-2.5 w-3.5 rounded-full border-2 border-slate-900 bg-transparent"
      : mood === "celebrate"
        ? "h-3 w-5 rounded-b-full bg-slate-900"
        : "h-2 w-4 rounded-b-full border-b-[3px] border-slate-900";
  const blushClass =
    mood === "support" ? "bg-rose-200/70" : mood === "celebrate" ? "bg-fuchsia-200/80" : "bg-violet-200/70";
  const hornClass =
    equippedNovaItems.horn === "horn-crystal"
      ? "bg-gradient-to-b from-cyan-100 via-sky-100 to-violet-200"
      : equippedNovaItems.horn === "horn-sunbeam"
        ? "bg-gradient-to-b from-yellow-100 via-amber-200 to-orange-200"
        : "bg-gradient-to-b from-amber-100 via-yellow-200 to-violet-100";
  const maneLayers =
    equippedNovaItems.mane === "mane-rainbow"
      ? [
          "bg-rose-300/90",
          "bg-amber-200/90",
          "bg-emerald-300/90",
          "bg-sky-300/90",
        ]
      : equippedNovaItems.mane === "mane-comet"
        ? [
            "bg-slate-800/90",
            "bg-violet-400/85",
            "bg-fuchsia-300/85",
            "bg-sky-200/85",
          ]
        : [
            "bg-violet-300/90",
            "bg-fuchsia-300/85",
            "bg-sky-200/90",
            "bg-white/75",
          ];

  const mascotAnimation = prefersReducedMotion
    ? {}
    : mood === "celebrate"
      ? {
          y: [0, -12, 0],
          rotate: [0, -5, 5, 0],
          scale: [1, 1.06, 1],
        }
      : mood === "support"
        ? {
            x: [0, -4, 4, 0],
            y: [0, -4, 0],
          }
        : mood === "encourage"
          ? {
              y: [0, -8, 0],
              scale: [1, 1.04, 1],
            }
          : {
              y: [0, -6, 0],
            };

  return (
    <motion.aside
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="pointer-events-none fixed bottom-4 right-4 z-20 hidden w-[18rem] rounded-[2rem] border-4 border-white/90 bg-white/85 p-4 shadow-[0_20px_60px_rgba(76,29,149,0.18)] backdrop-blur md:block"
      aria-live="polite"
    >
      <div className="flex items-center gap-4">
        <motion.div
          key={mood}
          animate={mascotAnimation}
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: mood === "celebrate" ? 0.8 : 1.6, repeat: Infinity, ease: "easeInOut" }
          }
          className={`relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br ${copy.accent}`}
        >
          <div className="absolute inset-2 rounded-[1.6rem] bg-white/12" />
          <div className="absolute left-3 top-5 h-8 w-8 rounded-full bg-fuchsia-300/70 blur-[2px]" />
          <div className="absolute right-3 top-4 h-7 w-7 rounded-full bg-sky-200/80 blur-[2px]" />
          <div className="absolute left-5 top-2 h-5 w-5 rounded-full bg-white/50 blur-[1px]" />

          {equippedNovaItems.trail === "trail-stardust" ? (
            <>
              <div className="absolute left-1 top-7 h-2 w-2 rounded-full bg-white/90" />
              <div className="absolute left-3 top-11 h-1.5 w-1.5 rounded-full bg-fuchsia-200/90" />
              <div className="absolute left-2 bottom-8 h-2.5 w-2.5 rounded-full bg-sky-100/90" />
            </>
          ) : null}

          {equippedNovaItems.trail === "trail-cloud" ? (
            <>
              <div className="absolute bottom-3 left-1 h-4 w-4 rounded-full bg-white/80" />
              <div className="absolute bottom-4 left-4 h-5 w-5 rounded-full bg-white/80" />
              <div className="absolute bottom-3 left-7 h-4 w-4 rounded-full bg-white/75" />
            </>
          ) : null}

          <div className="absolute left-4 top-5 h-9 w-8 -rotate-[18deg] rounded-t-[1.2rem] rounded-br-[1rem] bg-white shadow-sm" />
          <div className="absolute right-4 top-5 rotate-[18deg] rounded-t-[1.2rem] rounded-bl-[1rem] bg-white shadow-sm">
            <div className="h-9 w-8" />
          </div>
          <div className="absolute left-[1.35rem] top-8 h-4 w-4 -rotate-[18deg] rounded-t-full rounded-br-full bg-violet-200" />
          <div className="absolute right-[1.35rem] top-8 h-4 w-4 rotate-[18deg] rounded-t-full rounded-bl-full bg-fuchsia-200" />

          <motion.div
            animate={
              prefersReducedMotion
                ? undefined
                : mood === "celebrate"
                  ? { y: [0, -2, 0], rotate: [-8, -2, -8] }
                  : { y: [0, -1, 0] }
            }
            transition={prefersReducedMotion ? undefined : { duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute left-1/2 top-2 h-8 w-3 -translate-x-1/2 -rotate-[8deg] rounded-full shadow-sm ${hornClass}`}
          />

          <div className={`absolute left-4 top-7 h-6 w-6 rounded-full ${maneLayers[0]}`} />
          <div className={`absolute left-7 top-4 h-6 w-5 rounded-full ${maneLayers[1]}`} />
          <div className={`absolute right-5 top-6 h-6 w-5 rounded-full ${maneLayers[2]}`} />
          <div className={`absolute right-7 top-4 h-5 w-4 rounded-full ${maneLayers[3]}`} />

          <div className="absolute bottom-3 left-1/2 h-14 w-[3.9rem] -translate-x-1/2 rounded-[45%] bg-white shadow-[inset_0_-8px_18px_rgba(139,92,246,0.08)]" />
          <div className="absolute bottom-2 left-1/2 h-5 w-10 -translate-x-1/2 rounded-full bg-violet-100/85" />
          <div className="absolute bottom-6 left-[1.9rem] h-2.5 w-2.5 rounded-full bg-slate-900" />
          <div className="absolute bottom-6 right-[1.9rem] h-2.5 w-2.5 rounded-full bg-slate-900" />
          <div className="absolute bottom-[2.05rem] left-[2.05rem] h-1 w-1 rounded-full bg-white" />
          <div className="absolute bottom-[2.05rem] right-[2.05rem] h-1 w-1 rounded-full bg-white" />
          <div className="absolute bottom-5 left-4 h-2.5 w-2.5 rounded-full bg-slate-900/20" />
          <div className="absolute bottom-5 right-4 h-2.5 w-2.5 rounded-full bg-slate-900/20" />
          <div className={`absolute bottom-[0.95rem] left-4 h-3 w-3 rounded-full ${blushClass}`} />
          <div className={`absolute bottom-[0.95rem] right-4 h-3 w-3 rounded-full ${blushClass}`} />
          <div className={`absolute bottom-[0.95rem] left-1/2 -translate-x-1/2 ${mouthClass}`} />

          <div
            className={`absolute bottom-[2.85rem] left-[1.45rem] h-1 w-4 rounded-full bg-slate-900 ${
              mood === "support" ? "-rotate-[18deg]" : "rotate-[8deg]"
            }`}
          />
          <div
            className={`absolute bottom-[2.85rem] right-[1.45rem] h-1 w-4 rounded-full bg-slate-900 ${
              mood === "support" ? "rotate-[18deg]" : "-rotate-[8deg]"
            }`}
          />

          {equippedNovaItems.accessory === "accessory-crown" ? (
            <>
              <div className="absolute left-1/2 top-[1.1rem] h-3 w-8 -translate-x-1/2 rounded-full bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-200" />
              <div className="absolute left-[2.05rem] top-[0.8rem] h-3 w-3 rotate-[-12deg] rounded-t-full bg-yellow-200" />
              <div className="absolute left-1/2 top-[0.45rem] h-3 w-3 -translate-x-1/2 rounded-t-full bg-amber-300" />
              <div className="absolute right-[2.05rem] top-[0.8rem] h-3 w-3 rotate-[12deg] rounded-t-full bg-yellow-200" />
            </>
          ) : null}

          {equippedNovaItems.accessory === "accessory-glasses" ? (
            <>
              <div className="absolute bottom-[1.45rem] left-[1.4rem] h-4 w-4 rounded-full border-2 border-fuchsia-400 bg-white/60" />
              <div className="absolute bottom-[1.45rem] right-[1.4rem] h-4 w-4 rounded-full border-2 border-fuchsia-400 bg-white/60" />
              <div className="absolute bottom-[1.9rem] left-1/2 h-0.5 w-3 -translate-x-1/2 bg-fuchsia-400" />
            </>
          ) : null}

          <div className="absolute bottom-0 left-1/2 h-3 w-14 -translate-x-1/2 rounded-t-full bg-white/70" />

          {!prefersReducedMotion && mood === "celebrate" ? (
            <>
              <motion.span
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute right-1 top-1 text-xl text-white"
              >
                *
              </motion.span>
              <motion.span
                animate={{ scale: [1, 1.25, 1], opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                className="absolute left-1 bottom-3 text-lg text-white"
              >
                *
              </motion.span>
            </>
          ) : null}
        </motion.div>

        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-500">Mascot Guide</p>
          <p className="mt-1 text-lg font-black text-slate-900">{copy.title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{copy.subtitle}</p>
        </div>
      </div>
    </motion.aside>
  );
}
