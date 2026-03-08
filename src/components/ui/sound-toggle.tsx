"use client";

import { motion, useReducedMotion } from "framer-motion";

import { usePlayerStore } from "@/features/profile/player-store";
import { playSoundEffect, unlockSound } from "@/lib/sound-effects";

export function SoundToggle() {
  const soundEnabled = usePlayerStore((state) => state.settings.soundEnabled);
  const setSoundEnabled = usePlayerStore((state) => state.setSoundEnabled);
  const prefersReducedMotion = useReducedMotion();

  async function handleToggle() {
    const nextEnabled = !soundEnabled;

    setSoundEnabled(nextEnabled);

    if (nextEnabled) {
      await unlockSound();
      await playSoundEffect("tap", true);
    }
  }

  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.02 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
      className={`rounded-full border-2 px-4 py-2 text-sm font-black shadow-sm transition ${
        soundEnabled
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-white text-slate-600"
      }`}
      aria-pressed={soundEnabled}
      aria-label={soundEnabled ? "Turn sound off" : "Turn sound on"}
    >
      {soundEnabled ? "Sound On" : "Sound Off"}
    </motion.button>
  );
}
