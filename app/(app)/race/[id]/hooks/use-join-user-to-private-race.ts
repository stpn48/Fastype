"use client";

import { joinUserToRace } from "@/app/actions/join-user-to-race";
import { useRaceStore } from "@/hooks/zustand/use-race-store";
import { RaceUser } from "@/types/types";
import { race } from "@prisma/client";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

export function useJoinUserToPrivateRace(raceDetails: race, userId: string) {
  const { raceUsers } = useRaceStore();

  const joinUserToThisRace = useCallback(async () => {
    const { race, error } = await joinUserToRace(raceDetails.id);

    if (error) {
      toast.error("error joining user to this race " + error);
      return;
    }

    if (!race || !race.users) {
      toast.error("Unexpected error joining user to the race, try again");
      return;
    }
  }, [raceDetails.id]);

  // join user if this race is private and user is not in the race
  useEffect(() => {
    if (raceDetails.type === "private" && !isUserInThisRace(raceUsers, userId)) {
      joinUserToThisRace();
    }
  }, [raceDetails.type, raceUsers, userId, joinUserToThisRace]);
}

function isUserInThisRace(raceUsers: RaceUser[], userId: string) {
  return raceUsers.find((user) => user.id === userId);
}
