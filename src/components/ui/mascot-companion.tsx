"use client";

import { motion, useReducedMotion } from "framer-motion";

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
    accent: "from-amber-400 to-orange-500",
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
          className={`relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${copy.accent}`}
        >
          <div className="absolute h-14 w-14 rounded-full bg-white" />
          <div className="absolute top-[1.95rem] flex gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />
          </div>
          <div
            className={`absolute top-[3.2rem] h-2 rounded-full bg-slate-900 ${
              mood === "support"
                ? "w-5"
                : mood === "celebrate"
                  ? "w-8"
                  : "w-6"
            }`}
          />
          {!prefersReducedMotion && mood === "celebrate" ? (
            <>
              <motion.span
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute -right-1 top-1 text-xl"
              >
                *
              </motion.span>
              <motion.span
                animate={{ scale: [1, 1.25, 1], opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                className="absolute -left-1 bottom-2 text-lg"
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
