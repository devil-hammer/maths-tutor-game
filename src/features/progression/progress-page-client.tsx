"use client";

import { badges, operationLabels } from "@/lib/content";
import { getLevelProgress, getMastery, getSkillOrder, getOverallAccuracy } from "@/lib/game-logic";
import { usePlayerStore } from "@/features/profile/player-store";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatPercent } from "@/lib/utils";

export function ProgressPageClient() {
  const profile = usePlayerStore((state) => state.profile);
  const skills = usePlayerStore((state) => state.skills);

  return (
    <div className="grid gap-6">
      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[2.5rem] border-4 border-white bg-white/90 p-6 shadow-xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-500">Your Progress</p>
          <h2 className="mt-2 text-4xl font-black text-slate-900">Level {profile.level} explorer</h2>
          <p className="mt-3 text-lg leading-8 text-slate-600">
            Keep playing short missions to grow your streak, unlock badges, and master each skill.
          </p>

          <div className="mt-6 space-y-4">
            <ProgressBar value={getLevelProgress(profile)} label="Next level" />
            <ProgressBar
              value={getOverallAccuracy(profile)}
              label="Overall accuracy"
              colorClassName="bg-gradient-to-r from-emerald-400 to-sky-500"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SummaryCard label="Sessions played" value={profile.sessionsCompleted.toString()} />
          <SummaryCard label="Questions answered" value={profile.totalQuestions.toString()} />
          <SummaryCard label="Best streak" value={`${profile.bestStreakDays} days`} />
          <SummaryCard label="Badges unlocked" value={profile.badges.length.toString()} />
        </div>
      </section>

      <section className="rounded-[2.5rem] border-4 border-white bg-white/90 p-6 shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-500">Skill Map</p>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {getSkillOrder().map((operation) => {
            const skill = skills[operation];
            const mastery = getMastery(skill);

            return (
              <div key={operation} className="rounded-[1.75rem] bg-slate-100 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-900">{operationLabels[operation]}</h3>
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-600">
                    Level {skill.highestDifficulty}
                  </span>
                </div>
                <ProgressBar value={mastery} label="Mastery" />
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <MiniStat label="Correct" value={skill.totalCorrect.toString()} />
                  <MiniStat label="Answered" value={skill.totalAnswered.toString()} />
                  <MiniStat label="Accuracy" value={formatPercent(mastery)} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-[2.5rem] border-4 border-white bg-white/90 p-6 shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-500">Badge Shelf</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {badges.map((badge) => {
            const unlocked = profile.badges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`rounded-[1.75rem] border-4 p-5 ${
                  unlocked
                    ? "border-amber-200 bg-amber-50"
                    : "border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                <p className="text-lg font-black">{badge.title}</p>
                <p className="mt-2 text-sm leading-6">{badge.description}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em]">
                  {unlocked ? "Unlocked" : "Keep Going"}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[2rem] border-4 border-white bg-white/90 p-5 shadow-xl">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-4xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] bg-white px-3 py-3 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-black text-slate-900">{value}</p>
    </div>
  );
}
