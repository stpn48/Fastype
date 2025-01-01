"use client";

import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { supabaseJsClient } from "@/lib/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function useBroadcastUserProgress(userId?: string, raceId?: string) {
  const { userProgress } = useTypingFieldStore();

  const channel = useRef<RealtimeChannel | null>(null);
  const [channelSubscribed, setChannelSubscribed] = useState(false);

  const subscribeToRaceChannel = useCallback(() => {
    // subscribe to this race's channel
    channel.current = supabaseJsClient.channel(`race-${raceId}`, {
      config: {
        broadcast: { self: true },
      },
    });

    channel.current.subscribe((status) => {
      if (status === "SUBSCRIBED" && !channelSubscribed) {
        setChannelSubscribed(true);
      }
    });
  }, [raceId, channelSubscribed]);

  useEffect(() => {
    // dont run in practice races
    if (!userId || !raceId) return;

    // subscribe to channel if not subscribed
    if (!channelSubscribed || !channel.current) {
      subscribeToRaceChannel();
      return;
    }

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

    return () => {
      if (channel.current) {
        channel.current.unsubscribe();
        supabaseJsClient.removeChannel(channel.current);
      }
    };
  }, [userProgress, channelSubscribed, subscribeToRaceChannel]);
}
