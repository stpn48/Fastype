"use client";

import { createClient } from "@/lib/supabase/client";
import { RaceUser, useRaceUsers } from "./use-race-users";
import { UserTrack } from "./user-track";

type Props = {
  raceId: string;
  initialRaceUsers: RaceUser[];
};

export function RaceTrack({ raceId, initialRaceUsers }: Props) {
  const supabase = createClient();

  const { raceUsers, countdown } = useRaceUsers(supabase, raceId, initialRaceUsers);

  return (
    <div className="flex w-full flex-col rounded-lg border border-border">
      {raceUsers.map((raceUser) => (
        <UserTrack key={raceUser.id} raceUser={raceUser} />
      ))}
      <span>Countdown: {countdown}</span>
    </div>
  );
}
