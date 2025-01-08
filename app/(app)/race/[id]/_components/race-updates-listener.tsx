"use client";

import { getRaceUsers } from "@/app/actions/get-race-users";
import { useRaceStore } from "@/hooks/zustand/use-race-store";
import { listenForRaceUpdates } from "@/lib/listen-for-race-updates";
import { supabaseJsClient } from "@/lib/supabase/client";
import { RaceUser } from "@/types/types";
import { RealtimeChannel, RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

type Props = {
  raceId: string;
};

export function RaceUpdatesListener({ raceId }: Props) {
  const { setCountdown, setRaceUsers } = useRaceStore();

  // fetch race participants
  const getRaceParticipants = useCallback(async (raceId: string, raceStarted: boolean) => {
    const raceUsers = (await getRaceUsers(raceId)) as RaceUser[];

    if (!raceUsers) {
      toast.error("Error getting race users");
      return;
    }

    // update race users if the race has not started yet
    if (!raceStarted) {
      setRaceUsers(raceUsers);
    }
  }, []);

  const onRaceUpdate = useCallback(
    async (payload: RealtimePostgresUpdatePayload<{ [key: string]: any }>) => {
      const { started_at, status } = payload.new;

      // check if race is not solo, has not started yet and is closed, if so, set countdown to 5 (start the race)
      if (status === "closed" && !started_at) {
        toast.dismiss();
        setCountdown(5);
      }

      // get race participants every time the race is updated
      await getRaceParticipants(raceId, !!started_at);
    },
    [getRaceParticipants, raceId],
  );

  // get race participants on mount
  useEffect(() => {
    getRaceParticipants(raceId, false);
  }, [getRaceParticipants, raceId]);

  useEffect(() => {
    let channel: RealtimeChannel | null = null;

    (async () => {
      const onSubscribe = () => {
        toast.success("Subscribed to race updates");
      };

      channel = await listenForRaceUpdates(raceId, onRaceUpdate, onSubscribe);

      if (!channel) {
        toast.error("Error subscribing to race updates");
        return;
      }
    })();

    return () => {
      if (channel) {
        toast.info("Unsubscribing from race updates");
        channel.unsubscribe();
        supabaseJsClient.removeChannel(channel);
      }
    };
  }, [raceId, onRaceUpdate]);

  return null;
}
