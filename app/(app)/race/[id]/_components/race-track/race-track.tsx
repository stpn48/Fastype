"use client";

import { Race } from "@prisma/client";
import { useState } from "react";
import { RaceUser, useRaceUsers } from "./hooks/use-race-users";
import { UserTrack } from "./user-track";

type Props = {
  userId: string;
  raceDetails: Race & { users: RaceUser[] };
};

export function RaceTrack({ userId, raceDetails }: Props) {
  const [place, setPlace] = useState<number>(1);
  const { raceUsers } = useRaceUsers(userId, raceDetails);

  return (
    <div className="flex w-full flex-col rounded-lg border border-border">
      {raceUsers.map((raceUser) => (
        <UserTrack
          key={raceUser.id}
          raceUser={raceUser}
          raceDetails={raceDetails}
          place={place}
          setPlace={setPlace}
        />
      ))}
    </div>
  );
}
