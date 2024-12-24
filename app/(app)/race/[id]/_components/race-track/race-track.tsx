"use client";

import { RaceUser } from "@/types/types";
import { Race } from "@prisma/client";
import { useJoinUserToPrivateRace } from "../../hooks/use-join-user-to-private-race";
import { useRaceUsers } from "./hooks/use-race-users";
import { UserTrack } from "./user-track";

type Props = {
  userId: string;
  raceDetails: Race & { users: RaceUser[] };
};

export function RaceTrack({ userId, raceDetails }: Props) {
  const { raceUsers } = useRaceUsers(raceDetails);
  useJoinUserToPrivateRace(raceDetails.id, raceDetails.type, raceUsers, userId);

  return (
    <div className="flex w-full flex-col rounded-lg border border-border">
      {raceUsers.map((raceUser) => (
        <UserTrack key={raceUser.id} raceUser={raceUser} raceDetails={raceDetails} />
      ))}
    </div>
  );
}
