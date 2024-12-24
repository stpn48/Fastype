"use client";

import { RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import { supabase } from "./supabase/client";

export function listenForRaceUpdates(
  raceId: string,
  callback: (
    payload: RealtimePostgresUpdatePayload<{
      [key: string]: any;
    }>,
  ) => void,
  onSubscribe?: () => void,
) {
  const channel = supabase
    .channel("race-updates")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "Race",
        filter: `id=eq.${raceId}`,
      },
      callback,
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        onSubscribe?.();
      }
    });

  return channel;
}
