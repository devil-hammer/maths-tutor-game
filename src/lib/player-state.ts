import { operations } from "@/lib/content";
import { createDefaultProfile, createDefaultSkills } from "@/lib/game-logic";
import { MascotId, OrbitItemId, PersistedPlayerState, SkillMap } from "@/lib/types";

export const PLAYER_STORE_STORAGE_KEY = "maths-tutor-player-store";

type JsonObject = Record<string, unknown>;

function createDefaultSettings() {
  return {
    soundEnabled: false,
  };
}

function isRecord(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null;
}

function normalizeSkills(value: unknown): SkillMap {
  const defaults = createDefaultSkills();

  if (!isRecord(value)) {
    return defaults;
  }

  for (const operation of operations) {
    const nextSkill = value[operation];

    if (isRecord(nextSkill)) {
      defaults[operation] = {
        ...defaults[operation],
        ...nextSkill,
      };
    }
  }

  return defaults;
}

export function createInitialPlayerState(playerName = "Maths Explorer"): PersistedPlayerState {
  return {
    profile: createDefaultProfile(playerName),
    skills: createDefaultSkills(),
    settings: createDefaultSettings(),
    activeSession: null,
  };
}

export function normalizePersistedPlayerState(
  value: unknown,
  fallbackPlayerName = "Maths Explorer",
): PersistedPlayerState {
  const defaults = createInitialPlayerState(fallbackPlayerName);

  if (!isRecord(value)) {
    return defaults;
  }

  const nextProfile = isRecord(value.profile)
    ? {
        ...defaults.profile,
        ...value.profile,
      }
    : defaults.profile;
  const playerName =
    typeof nextProfile.playerName === "string" && nextProfile.playerName.trim().length > 0
      ? nextProfile.playerName.trim()
      : fallbackPlayerName;
  const ownedMascots = Array.isArray(nextProfile.ownedMascots)
    ? nextProfile.ownedMascots.filter((mascotId): mascotId is "nova" | "orbit" => mascotId === "nova" || mascotId === "orbit")
    : defaults.profile.ownedMascots;
  const normalizedOwnedMascots: MascotId[] = ownedMascots.includes("nova") ? ownedMascots : ["nova", ...ownedMascots];
  if (typeof nextProfile.stars === "number" && nextProfile.stars >= 25 && !normalizedOwnedMascots.includes("orbit")) {
    normalizedOwnedMascots.push("orbit");
  }
  const activeMascotId =
    nextProfile.activeMascotId === "orbit" && normalizedOwnedMascots.includes("orbit") ? "orbit" : "nova";
  const ownedOrbitItems = Array.isArray(nextProfile.ownedOrbitItems)
    ? nextProfile.ownedOrbitItems.filter(
        (itemId): itemId is OrbitItemId =>
          itemId === "wings-feather" ||
          itemId === "wings-comet" ||
          itemId === "wings-nebula" ||
          itemId === "horns-stardust" ||
          itemId === "horns-crystal" ||
          itemId === "horns-sunflare" ||
          itemId === "orbit-accessory-none" ||
          itemId === "orbit-accessory-cape" ||
          itemId === "orbit-accessory-bandana" ||
          itemId === "orbit-trail-none" ||
          itemId === "orbit-trail-embers" ||
          itemId === "orbit-trail-moons",
      )
    : defaults.profile.ownedOrbitItems;

  return {
    profile: {
      ...nextProfile,
      playerName,
      ownedMascots: normalizedOwnedMascots,
      activeMascotId,
      ownedOrbitItems,
      equippedOrbitItems: isRecord(nextProfile.equippedOrbitItems)
        ? {
            ...defaults.profile.equippedOrbitItems,
            ...nextProfile.equippedOrbitItems,
          }
        : defaults.profile.equippedOrbitItems,
    },
    skills: normalizeSkills(value.skills),
    settings: isRecord(value.settings)
      ? {
          ...defaults.settings,
          ...value.settings,
        }
      : defaults.settings,
    activeSession: isRecord(value.activeSession)
      ? (value.activeSession as unknown as PersistedPlayerState["activeSession"])
      : null,
  };
}

export function parseLegacyPersistedPlayerState(rawValue: string | null) {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as { state?: unknown } | unknown;

    if (isRecord(parsed) && "state" in parsed) {
      return normalizePersistedPlayerState(parsed.state);
    }

    return normalizePersistedPlayerState(parsed);
  } catch {
    return null;
  }
}

export function hasMeaningfulPlayerProgress(state: PersistedPlayerState) {
  return (
    state.profile.sessionsCompleted > 0 ||
    state.profile.totalQuestions > 0 ||
    state.profile.xp > 0 ||
    state.profile.badges.length > 0 ||
    state.activeSession !== null
  );
}
