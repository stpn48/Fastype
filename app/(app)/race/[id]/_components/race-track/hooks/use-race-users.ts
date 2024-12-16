import { getRaceUsers } from "@/app/actions/get-race-usesr";
import { joinUserToRace } from "@/app/actions/join-user-to-race";
import { Race } from "@prisma/client";
import { createClient, RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
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

  const getRaceParticipants = useCallback(async (raceId: string) => {
    const raceUsers = await getRaceUsers(raceId);

    if (!raceUsers) {
      toast.error("Error getting race users");
      return;
    }

    setRaceUsers(raceUsers);
  }, []);

  useEffect(() => {
    // don't lister for race updates to get users on solo races for obvious reasons
    if (raceDetails.type === "solo") return;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const channel = supabase
      .channel("listen-for-race-inserts")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Race",
          filter: `id=eq.${raceDetails.id}`,
        },
        async (payload: RealtimePostgresChangesPayload<Race>) => {
          const newRace = payload.new as RaceUser;
          await getRaceParticipants(newRace.id);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [raceDetails]);

  // if user gets to the race page, that means ge got a link or guessed the raceId (never gonna happen) join the user to this race
  useEffect(() => {
    async function joinUser() {
      toast.loading("Joining user to race...");

      const { race, error } = await joinUserToRace(raceDetails.id);
      toast.dismiss();
      toast.success("Joined user to race");

      if (error) {
        toast.error("error joining user to this race " + error);
        return;
      }

      if (!race || !race.users) {
        toast.error("Unexpected error joining user to the race, try again");
        return;
      }
    }

    if (raceDetails.type === "private" && raceUsers.some((user) => user.id !== userId)) {
      joinUser();
    }
  }, [raceDetails, raceUsers]);

  return { raceUsers };
}
