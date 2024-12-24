"use client";

import { getRaceUsers } from "@/app/actions/get-race-users";
import { useRaceStore } from "@/hooks/zustand/use-race-store";
import { listenForRaceUpdates } from "@/lib/listen-for-race-updates";
import { supabase } from "@/lib/supabase/client";
import { RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

type Props = {
  raceId: string;
};

export function RaceUpdatesListener({ raceId }: Props) {
  const { raceStartedAt, setRaceStartedAt, setCountdown, setRaceUsers } = useRaceStore();

  // fetch race participants
  const getRaceParticipants = useCallback(
    async (raceId: string) => {
      const raceUsers = await getRaceUsers(raceId);

      if (!raceUsers) {
        toast.error("Error getting race users");
        return;
      }

      // update race users if the race has not started yet
      if (!raceStartedAt) {
        setRaceUsers(raceUsers);
      }
    },
    [raceStartedAt],
  );

  const onRaceUpdate = useCallback(
    async (payload: RealtimePostgresUpdatePayload<{ [key: string]: any }>) => {
      console.log("payload", payload);
      const { startedAt, status, type } = payload.new;

      setRaceStartedAt(startedAt);

      // check if race is not solo, has not started yet and is closed, if so, set countdown to 5 (start the race)
      if (type !== "solo" && !startedAt && status === "closed") {
        toast.dismiss();
        setCountdown(5);
      }

      // get race participants
      await getRaceParticipants(raceId);
    },
    [],
  );

  // get race participants on mount
  useEffect(() => {
    getRaceParticipants(raceId);
  }, [getRaceParticipants, raceId]);

  useEffect(() => {
    const channel = listenForRaceUpdates(raceId, onRaceUpdate, () => console.log("subscribed"));

    return () => {
      channel.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [raceId, onRaceUpdate]);

  return null;
}
