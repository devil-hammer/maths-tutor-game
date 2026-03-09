"use client";

import { useLayoutEffect } from "react";

import { usePlayerStore } from "@/features/profile/player-store";
import { PersistedPlayerState } from "@/lib/types";

interface PlayerStoreHydratorProps {
  progress: PersistedPlayerState;
}

export function PlayerStoreHydrator({ progress }: PlayerStoreHydratorProps) {
  const hydrateFromServer = usePlayerStore((state) => state.hydrateFromServer);

  useLayoutEffect(() => {
    hydrateFromServer(progress);
  }, [hydrateFromServer, progress]);

  return null;
}
