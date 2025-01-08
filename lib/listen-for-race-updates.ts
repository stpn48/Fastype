"use client";

import { RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import { supabaseJsClient } from "./supabase/client";
import { subscribeToChannel } from "./utils";

export async function listenForRaceUpdates(
  raceId: string,
  callback: (
    payload: RealtimePostgresUpdatePayload<{
      [key: string]: any;
    }>,
  ) => void,
  onSubscribe?: () => void,
) {
  const channel = supabaseJsClient.channel(`race-updates${raceId}`).on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "race",
      filter: `id=eq.${raceId}`,
    },
    callback,
  );

  const chanelSubscribed = await subscribeToChannel(channel, onSubscribe);

  if (!chanelSubscribed) {
    return null;
  }

  return channel;
}
