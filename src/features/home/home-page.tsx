"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { MissionCard } from "@/components/ui/mission-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { missions } from "@/lib/content";
import { getLevelProgress, getMastery, getOverallAccuracy } from "@/lib/game-logic";
import {
  hasMeaningfulPlayerProgress,
  parseLegacyPersistedPlayerState,
  PLAYER_STORE_STORAGE_KEY,
} from "@/lib/player-state";
import { usePlayerStore } from "@/features/profile/player-store";
import { PersistedPlayerState } from "@/lib/types";

export function HomePage() {
  const profile = usePlayerStore((state) => state.profile);
  const skills = usePlayerStore((state) => state.skills);
  const settings = usePlayerStore((state) => state.settings);
  const activeSession = usePlayerStore((state) => state.activeSession);
  const isHydrated = usePlayerStore((state) => state.isHydrated);
  const isSaving = usePlayerStore((state) => state.isSaving);
  const saveError = usePlayerStore((state) => state.saveError);
  const importLegacyProgress = usePlayerStore((state) => state.importLegacyProgress);
  const [legacyDismissed, setLegacyDismissed] = useState(false);
  const [legacyImportError, setLegacyImportError] = useState<string | null>(null);

  const missionMastery = useMemo(
    () =>
      missions.map((mission) => {
        const masteryValues = mission.operations.map((operation) => getMastery(skills[operation]));
        const averageMastery =
          masteryValues.reduce((total, value) => total + value, 0) / masteryValues.length;

        return {
          missionId: mission.id,
          mastery: averageMastery,
        };
      }),
    [skills],
  );
  const legacyProgress = useMemo<PersistedPlayerState | null>(() => {
    if (!isHydrated || typeof window === "undefined") {
      return null;
    }

    if (hasMeaningfulPlayerProgress({ profile, skills, settings, activeSession })) {
      return null;
    }

    const parsedLegacyProgress = parseLegacyPersistedPlayerState(
      window.localStorage.getItem(PLAYER_STORE_STORAGE_KEY),
    );

    return parsedLegacyProgress && hasMeaningfulPlayerProgress(parsedLegacyProgress)
      ? parsedLegacyProgress
      : null;
  }, [activeSession, isHydrated, profile, settings, skills]);

  async function handleImportLegacyProgress() {
    if (!legacyProgress) {
      return;
    }

    setLegacyImportError(null);

    try {
      await importLegacyProgress(legacyProgress);
      window.localStorage.removeItem(PLAYER_STORE_STORAGE_KEY);
      setLegacyDismissed(true);
    } catch (error) {
      setLegacyImportError(error instanceof Error ? error.message : "Unable to import your saved local progress.");
    }
  }

  if (!isHydrated) {
    return (
      <div className="rounded-[2rem] bg-white/90 p-8 text-center text-lg font-semibold text-slate-600 shadow-xl">
        Loading your saved progress...
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

      {legacyProgress && !legacyDismissed ? (
        <section className="rounded-[2rem] border-2 border-violet-200 bg-violet-50 px-5 py-5">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-700">Saved progress found</p>
          <p className="mt-2 text-sm leading-7 text-violet-900">
            We found progress from the old browser-only version of the app. Import it into this child account?
          </p>
          {legacyImportError ? (
            <p className="mt-3 rounded-[1rem] bg-white px-4 py-3 text-sm font-semibold text-rose-700">
              {legacyImportError}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void handleImportLegacyProgress()}
              disabled={isSaving}
              className="rounded-full bg-violet-500 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Importing..." : "Import Saved Progress"}
            </button>
            <button
              type="button"
              onClick={() => setLegacyDismissed(true)}
              className="rounded-full border-2 border-violet-300 bg-white px-5 py-3 text-sm font-black text-violet-900"
            >
              Not Now
            </button>
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.95fr]">
        <div className="rounded-[2.5rem] border-4 border-white bg-white/90 p-6 shadow-[0_18px_60px_rgba(14,165,233,0.2)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-500">Welcome Back</p>
              <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-900">
                Hi {profile.playerName}!
              </h2>
              <p className="mt-3 max-w-xl text-lg leading-8 text-slate-600">
                Pick a mission, win stars, and grow your maths powers one challenge at a time.
              </p>
            </div>

            <div className="rounded-[2rem] bg-gradient-to-br from-sky-500 to-violet-500 px-6 py-5 text-white shadow-xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">Level</p>
              <p className="mt-2 text-5xl font-black">{profile.level}</p>
              <p className="mt-2 text-sm font-semibold">{profile.xp} XP collected</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <StatBubble label="Stars" value={profile.stars.toString()} tone="fuchsia" />
            <StatBubble label="Coins" value={profile.coins.toString()} tone="sky" />
            <StatBubble label="Streak" value={`${profile.streakDays} days`} tone="violet" />
          </div>

          <div className="mt-6 space-y-4">
            <ProgressBar value={getLevelProgress(profile)} label="Level progress" />
            <ProgressBar
              value={getOverallAccuracy(profile)}
              label="Overall accuracy"
              colorClassName="bg-gradient-to-r from-violet-400 to-fuchsia-500"
            />
          </div>

          {activeSession ? (
            <div className="mt-6 rounded-[1.75rem] bg-emerald-50 px-5 py-4">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
                Mission Ready To Continue
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-700">
                Jump back into your current challenge and keep your streak glowing.
              </p>
              <Link
                href={`/play?mission=${activeSession.missionId}`}
                className="mt-4 inline-flex rounded-full bg-emerald-500 px-5 py-3 text-sm font-black text-white"
              >
                Continue Mission
              </Link>
            </div>
          ) : null}
        </div>

        <section className="rounded-[2.5rem] border-4 border-white bg-white/80 p-6 shadow-[0_18px_60px_rgba(168,85,247,0.16)]">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-500">
            Today&apos;s Goals
          </p>
          <div className="mt-4 grid gap-4">
            <GoalCard title="Finish 1 mission" description="A short win keeps your streak alive." />
            <GoalCard title="Earn 2 stars" description="Aim for careful and confident answers." />
            <GoalCard title="Try mixed practice" description="Blend skills to unlock more badges." />
          </div>
        </section>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">Choose A Mission</p>
            <h3 className="text-2xl font-black text-slate-900">Play quick maths adventures</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/shop"
              className="rounded-full border-2 border-violet-200 bg-violet-50 px-4 py-2 text-sm font-black text-violet-700"
            >
              Visit Shop
            </Link>
            <Link
              href="/progress"
              className="rounded-full border-2 border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700"
            >
              View Progress
            </Link>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {missions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              mastery={missionMastery.find((item) => item.missionId === mission.id)?.mastery ?? 0}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function StatBubble({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "fuchsia" | "sky" | "violet";
}) {
  const tones = {
    fuchsia: "bg-fuchsia-50 text-fuchsia-700",
    sky: "bg-sky-50 text-sky-700",
    violet: "bg-violet-50 text-violet-700",
  };

  return (
    <div className={`rounded-[1.75rem] px-4 py-4 ${tones[tone]}`}>
      <p className="text-sm font-bold uppercase tracking-[0.2em]">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}

function GoalCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[1.75rem] bg-slate-100 px-4 py-4">
      <p className="text-lg font-black text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
