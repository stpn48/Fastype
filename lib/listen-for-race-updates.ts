"use client";

import { RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import { supabaseJsClient } from "./supabase/client";

export function listenForRaceUpdates(
  raceId: string,
  callback: (
    payload: RealtimePostgresUpdatePayload<{
      [key: string]: any;
    }>,
  ) => void,
  onSubscribe?: () => void,
) {
  const channel = supabaseJsClient
    .channel("race-updates")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "race",
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
