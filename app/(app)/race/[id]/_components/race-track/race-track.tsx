"use client";

import { useRaceStore } from "@/hooks/zustand/use-race-store";
import { race } from "@prisma/client";
import { useJoinUserToPrivateRace } from "../../hooks/use-join-user-to-private-race";
import { useRaceProgress } from "./hooks/use-race-progress";
import { UserTrack } from "./user-track";

type Props = {
  userId: string;
  raceDetails: race;
};

export function RaceTrack({ userId, raceDetails }: Props) {
  const { raceUsers } = useRaceStore();

  const { progresses } = useRaceProgress(raceDetails.id);

  useJoinUserToPrivateRace(raceDetails, userId);

  if (!raceUsers.length) {
    return null;
  }

  return (
    <div className="flex w-full flex-col rounded-lg border border-border">
      {raceUsers.map((raceUser) => (
        <UserTrack
          userId={userId}
          key={raceUser.id}
          raceProgress={progresses[raceUser.id]}
          raceUser={raceUser}
        />
      ))}
    </div>
  );
}
