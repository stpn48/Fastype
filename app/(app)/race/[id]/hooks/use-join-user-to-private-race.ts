"use client";

import { joinUserToRace } from "@/app/actions/join-user-to-race";
import { RaceUser } from "@/types/types";
import { RaceType } from "@prisma/client";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

export function useJoinUserToPrivateRace(
  raceId: string,
  raceType: RaceType,
  raceUsers: RaceUser[],
  userId: string,
) {
  const joinUserToThisRace = useCallback(async () => {
    const { race, error } = await joinUserToRace(raceId);

    if (error) {
      toast.error("error joining user to this race " + error);
      return;
    }

    if (!race || !race.users) {
      toast.error("Unexpected error joining user to the race, try again");
      return;
    }
  }, [raceId]);

  // join user if this race is private and user is not in the race
  useEffect(() => {
    if (raceType === "private" && !isUserInThisRace(raceUsers, userId)) {
      joinUserToThisRace();
    }
  }, [raceType, raceUsers, userId, joinUserToThisRace]);
}

function isUserInThisRace(raceUsers: RaceUser[], userId: string) {
  return raceUsers.find((user) => user.id === userId);
}
