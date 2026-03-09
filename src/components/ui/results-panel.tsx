"use client";

import Link from "next/link";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { motion, useReducedMotion } from "framer-motion";

import { usePlayerStore } from "@/features/profile/player-store";
import { playSoundEffect } from "@/lib/sound-effects";
import { badges, missionMap } from "@/lib/content";
import { SessionSummary } from "@/lib/types";
import { formatPercent, formatTimeFromMs } from "@/lib/utils";

interface ResultsPanelProps {
  summary: SessionSummary;
}

export function ResultsPanel({ summary }: ResultsPanelProps) {
  const startMission = usePlayerStore((state) => state.startMission);
  const setMascotMood = usePlayerStore((state) => state.setMascotMood);
  const soundEnabled = usePlayerStore((state) => state.settings.soundEnabled);
  const prefersReducedMotion = useReducedMotion();
  const recommendedMission = missionMap[summary.recommendedMissionId];
  const unlockedBadges = badges.filter((badge) => summary.badgesUnlocked.includes(badge.id));

  useEffect(() => {
    setMascotMood("celebrate");
    void playSoundEffect("celebrate", soundEnabled);

    if (summary.badgesUnlocked.length > 0) {
      window.setTimeout(() => {
        void playSoundEffect("badge", soundEnabled);
      }, 280);
    }

    if (!prefersReducedMotion) {
      void confetti({
        particleCount: summary.badgesUnlocked.length > 0 ? 140 : 90,
        spread: 85,
        startVelocity: 34,
        origin: { y: 0.2 },
      });
    }

    return () => {
      setMascotMood(null);
    };
  }, [prefersReducedMotion, setMascotMood, soundEnabled, summary.badgesUnlocked.length]);

  return (
    <motion.section
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-[2rem] border-4 border-white bg-white/90 p-6 shadow-[0_18px_60px_rgba(192,132,252,0.22)]"
    >
      <motion.div
        initial={prefersReducedMotion ? false : { scale: 0.97, opacity: 0 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="rounded-[2rem] bg-gradient-to-br from-violet-100 via-white to-fuchsia-100 px-6 py-8 text-center"
      >
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-500">Mission Complete</p>
        <h2 className="mt-2 text-4xl font-black text-slate-900">You did an amazing job!</h2>
        <p className="mt-3 text-lg font-semibold text-slate-600">
          You earned {"⭐".repeat(summary.starsEarned)} and answered {summary.correctCount} out of{" "}
          {summary.totalQuestions} correctly.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: prefersReducedMotion ? 0 : 0.08,
              delayChildren: prefersReducedMotion ? 0 : 0.12,
            },
          },
        }}
        className="mt-6 grid gap-4 md:grid-cols-4"
      >
        <StatCard label="Accuracy" value={formatPercent(summary.accuracy)} />
        <StatCard label="Average Speed" value={formatTimeFromMs(summary.averageResponseTimeMs)} />
        <StatCard label="Coins" value={`+${summary.coinsEarned}`} />
        <StatCard label="XP" value={`+${summary.xpEarned}`} />
      </motion.div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, x: -18 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="rounded-[2rem] bg-slate-100 p-5"
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Unlocked Rewards</p>
          {unlockedBadges.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: prefersReducedMotion ? 0 : 0.1,
                  },
                },
              }}
              className="mt-4 grid gap-3"
            >
              {unlockedBadges.map((badge) => (
                <motion.div
                  key={badge.id}
                  variants={{
                    hidden: prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.92, y: 12 },
                    visible: { opacity: 1, scale: 1, y: 0 },
                  }}
                  transition={{ duration: 0.28 }}
                  className="rounded-[1.5rem] bg-white px-4 py-3"
                >
                  <p className="font-black text-slate-900">{badge.title}</p>
                  <p className="text-sm text-slate-600">{badge.description}</p>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="mt-4 text-sm text-slate-600">No new badges this time, but your streak and stars still count.</p>
          )}
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, x: 18 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.32 }}
          className="rounded-[2rem] bg-sky-50 p-5"
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">Next Mission</p>
          <h3 className="mt-2 text-2xl font-black text-slate-900">{recommendedMission.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{recommendedMission.description}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={`/play?mission=${recommendedMission.id}`}
              onClick={() => {
                void startMission(recommendedMission.id);
                void playSoundEffect("missionStart", soundEnabled);
              }}
              className="rounded-full bg-sky-500 px-5 py-3 text-sm font-black text-white"
            >
              Play Next
            </Link>
            <Link
              href={`/play?mission=${summary.missionId}`}
              onClick={() => {
                void startMission(summary.missionId);
                void playSoundEffect("missionStart", soundEnabled);
              }}
              className="rounded-full border-2 border-violet-200 bg-violet-50 px-5 py-3 text-sm font-black text-violet-700"
            >
              Replay Mission
            </Link>
            <Link
              href="/progress"
              className="rounded-full border-2 border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700"
            >
              See Progress
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 },
      }}
      transition={{ duration: 0.25 }}
      className="rounded-[1.5rem] bg-slate-100 px-4 py-4 text-center"
    >
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
    </motion.div>
  );
}
