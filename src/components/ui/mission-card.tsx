"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { usePlayerStore } from "@/features/profile/player-store";
import { playSoundEffect } from "@/lib/sound-effects";
import { MissionDefinition } from "@/lib/types";

interface MissionCardProps {
  mission: MissionDefinition;
  mastery: number;
  actionLabel?: string;
}

export function MissionCard({
  mission,
  mastery,
  actionLabel = "Start Mission",
}: MissionCardProps) {
  const startMission = usePlayerStore((state) => state.startMission);
  const setMascotMood = usePlayerStore((state) => state.setMascotMood);
  const soundEnabled = usePlayerStore((state) => state.settings.soundEnabled);
  const prefersReducedMotion = useReducedMotion();

  function handleStartMission() {
    void startMission(mission.id);
    setMascotMood("encourage");
    void playSoundEffect("missionStart", soundEnabled);
  }

  return (
    <motion.article
      whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="rounded-[2rem] border-4 border-white bg-white/90 p-5 shadow-[0_16px_50px_rgba(14,165,233,0.16)]"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-500">
            {mission.theme}
          </p>
          <h3 className="mt-1 text-2xl font-black text-slate-900">{mission.title}</h3>
        </div>
        <motion.div
          whileHover={prefersReducedMotion ? undefined : { rotate: [-6, 8, -2, 0], scale: 1.08 }}
          transition={{ duration: 0.4 }}
          className="text-4xl"
          aria-hidden="true"
        >
          {mission.emoji}
        </motion.div>
      </div>

      <p className="mb-4 text-sm leading-6 text-slate-600">{mission.description}</p>

      <div className="mb-5 rounded-3xl bg-slate-100 px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Mastery</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-black text-slate-900">{Math.round(mastery)}%</span>
          <span className="text-sm font-semibold text-slate-500">{mission.questionCount} questions</span>
        </div>
      </div>

      <Link
        href={`/play?mission=${mission.id}`}
        onClick={handleStartMission}
        className="inline-flex rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5"
      >
        {actionLabel}
      </Link>
    </motion.article>
  );
}
