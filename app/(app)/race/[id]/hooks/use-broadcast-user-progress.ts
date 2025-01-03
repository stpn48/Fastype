"use client";

import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { supabaseJsClient } from "@/lib/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function useBroadcastUserProgress(userId?: string, raceId?: string) {
  const { userProgress } = useTypingFieldStore();

  const channel = useRef<RealtimeChannel | null>(null);

  const subscribeToRaceChannel = useCallback(() => {
    if (channel.current) return;

    channel.current = supabaseJsClient.channel(`race-${raceId}`, {
      config: {
        broadcast: { self: true },
      },
    });

    channel.current.subscribe();
  }, [raceId]);

  useEffect(() => {
    subscribeToRaceChannel();

    return () => {
      if (channel.current) {
        channel.current.unsubscribe();
        supabaseJsClient.removeChannel(channel.current);
      }
    };
  }, [subscribeToRaceChannel]);

  useEffect(() => {
    // dont run in practice races
    if (!userId || !raceId) return;

    if (!channel.current) return;

    console.log("sending progress update");

    channel.current
      .send({
        type: "broadcast",
        event: `user-progress-update`,
        payload: {
          userId,
          progress: userProgress,
        },
      })
      .catch((error) => toast.error("Error sending progress update:", error));
  }, [userProgress, subscribeToRaceChannel, userId, raceId]);
}
