"use client";

import { useRace } from "@/hooks/zustand/use-race";
import { createClient } from "@/lib/supabase/client";
import { RaceStatus } from "@prisma/client";
import { Countdown } from "./countdown";
import { RaceUser, useRaceUsers } from "./use-race-users";
import { UserTrack } from "./user-track";

type Props = {
  raceId: string;
  initialRaceUsers: RaceUser[];
  raceStatus: RaceStatus;
};

export function RaceTrack({ raceId, initialRaceUsers, raceStatus }: Props) {
  const supabase = createClient();

  const { canType } = useRace();

  const { raceUsers, countdown, showCountdown } = useRaceUsers(
    supabase,
    raceId,
    initialRaceUsers,
    raceStatus,
  );

  return (
    <div className="flex w-full flex-col rounded-lg border border-border">
      {raceUsers.map((raceUser) => (
        <UserTrack key={raceUser.id} raceUser={raceUser} />
      ))}

      {showCountdown && <Countdown countdown={countdown} />}
      {!showCountdown && !canType && <p>Waiting for players</p>}
    </div>
  );
}
