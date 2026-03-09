"use client";

import { create } from "zustand";

import { mascotMap, novaShopItemMap } from "@/lib/content";
import {
  applyAnswerToSession,
  finalizeSession,
  startMissionSession,
} from "@/lib/game-logic";
import { createInitialPlayerState, normalizePersistedPlayerState } from "@/lib/player-state";
import {
  ActiveSession,
  MascotId,
  MascotMood,
  NovaItemId,
  PersistedPlayerState,
  SessionSummary,
} from "@/lib/types";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong while saving progress.";
}

interface PlayerStoreState {
  profile: PersistedPlayerState["profile"];
  skills: PersistedPlayerState["skills"];
  settings: PersistedPlayerState["settings"];
  activeSession: ActiveSession | null;
  isHydrated: boolean;
  isSaving: boolean;
  saveError: string | null;
  lastSummary: SessionSummary | null;
  mascotMood: MascotMood | null;
  hydrateFromServer: (progress: PersistedPlayerState) => void;
  startMission: (missionId: string) => Promise<void>;
  submitAnswer: (selectedAnswer: number, responseTimeMs: number) => Promise<void>;
  clearSummary: () => void;
  resetSession: () => Promise<void>;
  setSoundEnabled: (enabled: boolean) => Promise<void>;
  setMascotMood: (mood: MascotMood | null) => void;
  setActiveMascot: (mascotId: MascotId) => Promise<void>;
  buyNovaItem: (itemId: NovaItemId) => Promise<void>;
  equipNovaItem: (itemId: NovaItemId) => Promise<void>;
  importLegacyProgress: (progress: PersistedPlayerState) => Promise<void>;
}

const initialPlayerState = createInitialPlayerState();

function selectPersistedState(state: PlayerStoreState): PersistedPlayerState {
  return {
    profile: state.profile,
    skills: state.skills,
    settings: state.settings,
    activeSession: state.activeSession,
  };
}

async function saveProgress(progress: PersistedPlayerState) {
  const response = await fetch("/api/progress/current", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      progress,
    }),
  });

  const payload = (await response.json()) as { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? "Unable to save progress.");
  }
}

async function importLegacyProgress(progress: PersistedPlayerState) {
  const response = await fetch("/api/progress/import-legacy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      progress,
    }),
  });

  const payload = (await response.json()) as {
    error?: string;
    progress?: PersistedPlayerState;
  };

  if (!response.ok || !payload.progress) {
    throw new Error(payload.error ?? "Unable to import saved local progress.");
  }

  return normalizePersistedPlayerState(payload.progress);
}

export const usePlayerStore = create<PlayerStoreState>()((set, get) => ({
  ...initialPlayerState,
  isHydrated: false,
  isSaving: false,
  saveError: null,
  lastSummary: null,
  mascotMood: null,
  hydrateFromServer: (progress) =>
    set({
      ...normalizePersistedPlayerState(progress),
      isHydrated: true,
      isSaving: false,
      saveError: null,
      lastSummary: null,
      mascotMood: null,
    }),
  startMission: async (missionId) => {
    const { skills } = get();
    const nextProgress: PersistedPlayerState = {
      ...selectPersistedState(get()),
      activeSession: startMissionSession(missionId, skills),
    };

    set({
      ...nextProgress,
      isSaving: true,
      saveError: null,
      lastSummary: null,
    });

    try {
      await saveProgress(nextProgress);
      set({
        isSaving: false,
      });
    } catch (error) {
      set({
        isSaving: false,
        saveError: getErrorMessage(error),
      });
    }
  },
  submitAnswer: async (selectedAnswer, responseTimeMs) => {
    const { activeSession, skills, profile } = get();

    if (!activeSession) {
      return;
    }

    const nextStep = applyAnswerToSession(activeSession, selectedAnswer, responseTimeMs, skills);

    if (!nextStep.completed) {
      const nextProgress: PersistedPlayerState = {
        ...selectPersistedState(get()),
        activeSession: nextStep.session,
      };

      set({
        ...nextProgress,
        isSaving: true,
        saveError: null,
      });

      try {
        await saveProgress(nextProgress);
        set({
          isSaving: false,
        });
      } catch (error) {
        set({
          isSaving: false,
          saveError: getErrorMessage(error),
        });
      }
      return;
    }

    const completedSession = finalizeSession(nextStep.session, profile, skills);
    const nextProgress: PersistedPlayerState = {
      ...selectPersistedState(get()),
      profile: completedSession.profile,
      skills: completedSession.skills,
      activeSession: null,
    };

    set({
      ...nextProgress,
      isSaving: true,
      saveError: null,
      lastSummary: completedSession.summary,
    });

    try {
      await saveProgress(nextProgress);
      set({
        isSaving: false,
      });
    } catch (error) {
      set({
        isSaving: false,
        saveError: getErrorMessage(error),
      });
    }
  },
  clearSummary: () =>
    set({
      lastSummary: null,
    }),
  resetSession: async () => {
    const nextProgress: PersistedPlayerState = {
      ...selectPersistedState(get()),
      activeSession: null,
    };

    set({
      ...nextProgress,
      isSaving: true,
      saveError: null,
    });

    try {
      await saveProgress(nextProgress);
      set({
        isSaving: false,
      });
    } catch (error) {
      set({
        isSaving: false,
        saveError: getErrorMessage(error),
      });
    }
  },
  setSoundEnabled: async (enabled) => {
    const nextProgress: PersistedPlayerState = {
      ...selectPersistedState(get()),
      settings: {
        ...get().settings,
        soundEnabled: enabled,
      },
    };

    set({
      ...nextProgress,
      isSaving: true,
      saveError: null,
    });

    try {
      await saveProgress(nextProgress);
      set({
        isSaving: false,
      });
    } catch (error) {
      set({
        isSaving: false,
        saveError: getErrorMessage(error),
      });
    }
  },
  setMascotMood: (mood) =>
    set({
      mascotMood: mood,
    }),
  setActiveMascot: async (mascotId) => {
    const mascot = mascotMap[mascotId];

    if (!mascot) {
      throw new Error("That mascot could not be found.");
    }

    const profile = get().profile;

    if (!profile.ownedMascots.includes(mascotId)) {
      throw new Error(`Earn ${mascot.requiredStars} stars to unlock ${mascot.name}.`);
    }

    const nextProgress: PersistedPlayerState = {
      ...selectPersistedState(get()),
      profile: {
        ...profile,
        activeMascotId: mascotId,
      },
    };

    set({
      ...nextProgress,
      isSaving: true,
      saveError: null,
    });

    try {
      await saveProgress(nextProgress);
      set({
        isSaving: false,
      });
    } catch (error) {
      set({
        isSaving: false,
        saveError: getErrorMessage(error),
      });
      throw error;
    }
  },
  buyNovaItem: async (itemId) => {
    const item = novaShopItemMap[itemId];

    if (!item) {
      throw new Error("That Nova item could not be found.");
    }

    const profile = get().profile;

    if (profile.ownedNovaItems.includes(itemId)) {
      await get().equipNovaItem(itemId);
      return;
    }

    if (profile.stars < item.requiredStars) {
      throw new Error(`Earn ${item.requiredStars} stars to unlock ${item.title}.`);
    }

    if (profile.coins < item.costCoins) {
      throw new Error(`You need ${item.costCoins} coins to buy ${item.title}.`);
    }

    const nextProgress: PersistedPlayerState = {
      ...selectPersistedState(get()),
      profile: {
        ...profile,
        coins: profile.coins - item.costCoins,
        ownedNovaItems: [...profile.ownedNovaItems, itemId],
        equippedNovaItems: {
          ...profile.equippedNovaItems,
          [item.slot]: itemId,
        },
      },
    };

    set({
      ...nextProgress,
      isSaving: true,
      saveError: null,
    });

    try {
      await saveProgress(nextProgress);
      set({
        isSaving: false,
      });
    } catch (error) {
      set({
        isSaving: false,
        saveError: getErrorMessage(error),
      });
      throw error;
    }
  },
  equipNovaItem: async (itemId) => {
    const item = novaShopItemMap[itemId];

    if (!item) {
      throw new Error("That Nova item could not be found.");
    }

    const profile = get().profile;

    if (!profile.ownedNovaItems.includes(itemId)) {
      throw new Error(`Buy ${item.title} before equipping it.`);
    }

    const nextProgress: PersistedPlayerState = {
      ...selectPersistedState(get()),
      profile: {
        ...profile,
        equippedNovaItems: {
          ...profile.equippedNovaItems,
          [item.slot]: itemId,
        },
      },
    };

    set({
      ...nextProgress,
      isSaving: true,
      saveError: null,
    });

    try {
      await saveProgress(nextProgress);
      set({
        isSaving: false,
      });
    } catch (error) {
      set({
        isSaving: false,
        saveError: getErrorMessage(error),
      });
      throw error;
    }
  },
  importLegacyProgress: async (progress) => {
    set({
      isSaving: true,
      saveError: null,
    });

    try {
      const importedProgress = await importLegacyProgress(progress);

      set({
        ...importedProgress,
        isHydrated: true,
        isSaving: false,
        saveError: null,
        lastSummary: null,
      });
    } catch (error) {
      set({
        isSaving: false,
        saveError: getErrorMessage(error),
      });
      throw error;
    }
  },
}));
