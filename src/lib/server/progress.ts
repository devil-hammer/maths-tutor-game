import "server-only";

import { createInitialPlayerState, hasMeaningfulPlayerProgress, normalizePersistedPlayerState } from "@/lib/player-state";
import { AuthUser, PersistedPlayerState } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface UserProgressRow {
  user_id: string;
  profile: unknown;
  skills: unknown;
  settings: unknown;
  active_session: unknown;
}

function toDatabasePayload(userId: string, state: PersistedPlayerState) {
  return {
    user_id: userId,
    profile: state.profile,
    skills: state.skills,
    settings: state.settings,
    active_session: state.activeSession,
  };
}

export async function getOrCreateUserProgress(user: AuthUser) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("user_progress")
    .select("user_id, profile, skills, settings, active_session")
    .eq("user_id", user.id)
    .maybeSingle<UserProgressRow>();

  if (error) {
    throw new Error(`Unable to load progress: ${error.message}`);
  }

  if (data) {
    return normalizePersistedPlayerState({
      profile: data.profile,
      skills: data.skills,
      settings: data.settings,
      activeSession: data.active_session,
    }, user.username);
  }

  const defaultState = createInitialPlayerState(user.username);
  await saveUserProgress(user.id, defaultState);

  return defaultState;
}

export async function saveUserProgress(userId: string, state: PersistedPlayerState) {
  const supabase = createSupabaseServerClient();
  const payload = toDatabasePayload(userId, normalizePersistedPlayerState(state));
  const { error } = await supabase.from("user_progress").upsert(payload, {
    onConflict: "user_id",
  });

  if (error) {
    throw new Error(`Unable to save progress: ${error.message}`);
  }
}

export async function importLegacyUserProgress(user: AuthUser, incomingState: PersistedPlayerState) {
  const currentState = await getOrCreateUserProgress(user);

  if (hasMeaningfulPlayerProgress(currentState)) {
    throw new Error("This account already has saved progress, so the local import was not applied.");
  }

  const importedState = normalizePersistedPlayerState(incomingState, user.username);

  if (!hasMeaningfulPlayerProgress(importedState)) {
    throw new Error("No saved local progress was found to import.");
  }

  await saveUserProgress(user.id, {
    ...importedState,
    profile: {
      ...importedState.profile,
      playerName: importedState.profile.playerName || user.username,
    },
  });

  return getOrCreateUserProgress(user);
}
