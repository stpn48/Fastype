"use client";

import { RaceUser, useRaceUsers } from "./use-race-users";
import { UserTrack } from "./user-track";

type Props = {
  raceId: string;
  initialRaceUsers: RaceUser[];
};

export function RaceTrack({ raceId, initialRaceUsers }: Props) {
  const { raceUsers } = useRaceUsers(raceId, initialRaceUsers);

  return (
    <div className="flex w-full flex-col rounded-lg border border-border">
      {raceUsers.map((raceUser) => (
        <UserTrack key={raceUser.id} raceUser={raceUser} raceId={raceId} />
      ))}
    </div>
  );
}
