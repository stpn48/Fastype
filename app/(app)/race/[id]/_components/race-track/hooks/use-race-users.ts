import { getRaceUsers } from "@/app/actions/get-race-usesr";
import { joinUserToRace } from "@/app/actions/join-user-to-race";
import { listenForRaceUpdates } from "@/lib/listen-for-race-updates";
import { Race } from "@prisma/client";
import {
  createClient,
  RealtimeChannel,
  RealtimePostgresUpdatePayload,
} from "@supabase/supabase-js";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export type RaceUser = {
  id: string;
  clerkId: string;
  imageUrl: string | null;
  firstName: string | null;
  lastName: string | null;
};

export function useRaceUsers(userId: string, raceDetails: Race & { users: RaceUser[] }) {
  const [raceUsers, setRaceUsers] = useState<RaceUser[]>(raceDetails.users);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

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

  // join user on mount if this race is private and user is not in the race
  useEffect(() => {
    // if race is private and user is not in the race, join him
    if (raceDetails.type === "private" && !raceUsers.find((user) => user.id === userId)) {
      joinUser(raceDetails.id);
    }
  }, [raceDetails, raceUsers, userId]);

  return { raceUsers };
}

async function joinUser(raceId: string) {
  const { race, error } = await joinUserToRace(raceId);

  if (error) {
    toast.error("error joining user to this race " + error);
    return;
  }

  if (!race || !race.users) {
    toast.error("Unexpected error joining user to the race, try again");
    return;
  }
}
