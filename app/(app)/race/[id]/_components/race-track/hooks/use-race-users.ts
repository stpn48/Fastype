import { getRaceUsers } from "@/app/actions/get-race-users";
import { listenForRaceUpdates } from "@/lib/listen-for-race-updates";
import { supabase } from "@/lib/supabase/client";
import { RaceUser } from "@/types/types";
import { Race } from "@prisma/client";
import { RealtimeChannel, RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

export function useRaceUsers(raceDetails: Race & { users: RaceUser[] }) {
  const [raceUsers, setRaceUsers] = useState<RaceUser[]>(raceDetails.users);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const channelRef = useRef<RealtimeChannel | null>(null);

  // fetch race participants
  const getRaceParticipants = useCallback(async (raceId: string, startedAt: Date | null) => {
    const raceUsers = await getRaceUsers(raceId);

    if (!raceUsers) {
      toast.error("Error getting race users");
      return;
    }

    if (!startedAt) {
      setRaceUsers(raceUsers);
    }
  }, []);

  const subscribeToRaceUpdates = useCallback(() => {
    const onRaceUpdate = (payload: RealtimePostgresUpdatePayload<{ [key: string]: any }>) => {
      console.log("payload received", payload);

      const { startedAt } = payload.new;
      console.log("startedAt", startedAt);

      const awaitGetRaceParticipants = async () => {
        await getRaceParticipants(raceDetails.id, startedAt);
      };

      awaitGetRaceParticipants();
    };

    const onSubscribe = () => {
      console.log("subscribed to race changes");
      setIsSubscribed(true);
    };

    const channel = listenForRaceUpdates(supabase, raceDetails.id, onRaceUpdate, onSubscribe);

    channelRef.current = channel;
  }, [raceDetails, getRaceParticipants]);

  // listen for race updates to get users
  useEffect(() => {
    // don't listen for race updates to get users on solo races for obvious reasons
    if (raceDetails.type === "solo") return;

    if (!isSubscribed) {
      subscribeToRaceUpdates();
      return;
    }

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        supabase.removeChannel(channelRef.current);
        setIsSubscribed(false);
      }
    };
  }, [raceDetails, isSubscribed, subscribeToRaceUpdates]);

  return { raceUsers };
}
