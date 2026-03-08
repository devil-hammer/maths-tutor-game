"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import {
  applyAnswerToSession,
  createDefaultProfile,
  createDefaultSkills,
  finalizeSession,
  startMissionSession,
} from "@/lib/game-logic";
import {
  ActiveSession,
  AppSettings,
  MascotMood,
  PlayerProfile,
  SessionSummary,
  SkillMap,
} from "@/lib/types";

function createDefaultSettings(): AppSettings {
  return {
    soundEnabled: false,
  };
}

interface PlayerStoreState {
  profile: PlayerProfile;
  skills: SkillMap;
  settings: AppSettings;
  activeSession: ActiveSession | null;
  lastSummary: SessionSummary | null;
  mascotMood: MascotMood | null;
  startMission: (missionId: string) => void;
  submitAnswer: (selectedAnswer: number, responseTimeMs: number) => void;
  clearSummary: () => void;
  resetSession: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  setMascotMood: (mood: MascotMood | null) => void;
}

export const usePlayerStore = create<PlayerStoreState>()(
  persist(
    (set, get) => ({
      profile: createDefaultProfile(),
      skills: createDefaultSkills(),
      settings: createDefaultSettings(),
      activeSession: null,
      lastSummary: null,
      mascotMood: null,
      startMission: (missionId) =>
        set((state) => ({
          activeSession: startMissionSession(missionId, state.skills),
          lastSummary: null,
        })),
      submitAnswer: (selectedAnswer, responseTimeMs) => {
        const { activeSession, skills, profile } = get();

        if (!activeSession) {
          return;
        }

        const nextStep = applyAnswerToSession(
          activeSession,
          selectedAnswer,
          responseTimeMs,
          skills,
        );

        if (!nextStep.completed) {
          set({
            activeSession: nextStep.session,
          });
          return;
        }

        const completedSession = finalizeSession(nextStep.session, profile, skills);

        set({
          profile: completedSession.profile,
          skills: completedSession.skills,
          activeSession: null,
          lastSummary: completedSession.summary,
        });
      },
      clearSummary: () =>
        set({
          lastSummary: null,
        }),
      resetSession: () =>
        set({
          activeSession: null,
        }),
      setSoundEnabled: (enabled) =>
        set((state) => ({
          settings: {
            ...state.settings,
            soundEnabled: enabled,
          },
        })),
      setMascotMood: (mood) =>
        set({
          mascotMood: mood,
        }),
    }),
    {
      name: "maths-tutor-player-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        profile: state.profile,
        skills: state.skills,
        settings: state.settings,
        activeSession: state.activeSession,
      }),
    },
  ),
);
