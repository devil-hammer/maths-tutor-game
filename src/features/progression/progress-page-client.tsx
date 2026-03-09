"use client";

import { badges, operationLabels } from "@/lib/content";
import { getLevelProgress, getMastery, getSkillOrder, getOverallAccuracy } from "@/lib/game-logic";
import { usePlayerStore } from "@/features/profile/player-store";
import { ProgressBar } from "@/components/ui/progress-bar";
import { BadgeId } from "@/lib/types";
import { formatPercent } from "@/lib/utils";

export function ProgressPageClient() {
  const profile = usePlayerStore((state) => state.profile);
  const skills = usePlayerStore((state) => state.skills);
  const isHydrated = usePlayerStore((state) => state.isHydrated);
  const saveError = usePlayerStore((state) => state.saveError);

  if (!isHydrated) {
    return (
      <div className="rounded-[2rem] bg-white/90 p-8 text-center text-lg font-semibold text-slate-600 shadow-xl">
        Loading your progress...
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
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-500">Badge Shelf</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {badges.map((badge) => {
            const unlocked = profile.badges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`rounded-[1.75rem] border-4 p-5 ${
                  unlocked
                    ? "border-violet-200 bg-violet-50"
                    : "border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                <BadgeEmblem badgeId={badge.id} unlocked={unlocked} />
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

function BadgeEmblem({ badgeId, unlocked }: { badgeId: BadgeId; unlocked: boolean }) {
  const shellClass = unlocked
    ? "border-violet-200 bg-gradient-to-br from-white via-violet-50 to-fuchsia-100"
    : "border-slate-200 bg-white/80";
  const iconClass = unlocked ? "opacity-100" : "opacity-45 grayscale";

  return (
    <div
      className={`mb-4 flex h-24 w-24 items-center justify-center rounded-[2rem] border-4 shadow-sm ${shellClass}`}
      aria-hidden="true"
    >
      {badgeId === "first-flight" ? (
        <div className={`relative h-16 w-16 ${iconClass}`}>
          <div className="absolute left-1/2 top-5 h-8 w-8 -translate-x-1/2 rotate-45 rounded-[0.9rem] bg-gradient-to-br from-sky-400 to-violet-500" />
          <div className="absolute left-1 top-6 h-6 w-6 rounded-full bg-violet-200" />
          <div className="absolute right-1 top-6 h-6 w-6 rounded-full bg-fuchsia-200" />
          <div className="absolute left-1/2 top-1 h-4 w-4 -translate-x-1/2 rounded-full bg-amber-200" />
        </div>
      ) : null}

      {badgeId === "perfect-pilot" ? (
        <div className={`relative h-16 w-16 ${iconClass}`}>
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-amber-200 to-yellow-300" />
          <div className="absolute left-1/2 top-2 h-5 w-5 -translate-x-1/2 rounded-t-full bg-amber-300" />
          <div className="absolute left-4 top-5 h-3 w-3 rounded-t-full bg-yellow-200" />
          <div className="absolute right-4 top-5 h-3 w-3 rounded-t-full bg-yellow-200" />
          <div className="absolute left-[1.35rem] top-[1.9rem] h-2 w-5 rotate-[-45deg] rounded-full bg-white" />
          <div className="absolute left-[2.15rem] top-[1.55rem] h-2 w-8 rotate-[35deg] rounded-full bg-white" />
        </div>
      ) : null}

      {badgeId === "speedy-solver" ? (
        <div className={`relative h-16 w-16 ${iconClass}`}>
          <div className="absolute left-1/2 top-2 h-11 w-11 -translate-x-1/2 rounded-full border-[6px] border-sky-300 bg-white" />
          <div className="absolute left-1/2 top-6 h-2 w-2 -translate-x-1/2 rounded-full bg-violet-500" />
          <div className="absolute left-[2.1rem] top-[1.35rem] h-2 w-5 rotate-[-40deg] rounded-full bg-violet-500" />
          <div className="absolute right-[0.85rem] top-3 h-8 w-4 skew-x-[-20deg] rounded-[0.6rem] bg-gradient-to-b from-amber-200 to-orange-400" />
        </div>
      ) : null}

      {badgeId === "streak-starter" ? (
        <div className={`relative h-16 w-16 ${iconClass}`}>
          <div className="absolute left-1/2 top-2 h-12 w-10 -translate-x-1/2 rounded-[45%] bg-gradient-to-b from-fuchsia-300 via-violet-400 to-orange-400" />
          <div className="absolute left-1/2 top-5 h-6 w-4 -translate-x-1/2 rounded-[45%] bg-white/80" />
          <div className="absolute left-1/2 top-0 h-5 w-3 -translate-x-1/2 rounded-full bg-amber-200" />
        </div>
      ) : null}

      {badgeId === "number-ninja" ? (
        <div className={`relative h-16 w-16 ${iconClass}`}>
          <div className="absolute inset-2 rounded-[1.2rem] bg-gradient-to-br from-slate-800 to-violet-600" />
          <div className="absolute left-1/2 top-4 h-4 w-8 -translate-x-1/2 rounded-full bg-white/90" />
          <div className="absolute left-[1.65rem] top-[1.45rem] h-1.5 w-1.5 rounded-full bg-slate-900" />
          <div className="absolute right-[1.65rem] top-[1.45rem] h-1.5 w-1.5 rounded-full bg-slate-900" />
          <div className="absolute right-2 top-2 h-3 w-3 rotate-45 bg-amber-200" />
        </div>
      ) : null}
    </div>
  );
}
