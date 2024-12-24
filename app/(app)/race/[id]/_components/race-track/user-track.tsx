"use client";

import { cn } from "@/lib/utils";
import { RaceUser } from "@/types/types";
import { Race } from "@prisma/client";
import { useRaceProgress } from "./hooks/use-race-progress";
import { Track } from "./track";

type Props = {
  raceDetails: Race & { users: RaceUser[] };
  raceUser: RaceUser;
};

export function UserTrack({ raceDetails, raceUser }: Props) {
  const { raceProgress, wpm } = useRaceProgress(raceDetails, raceUser.id);

  return (
    <div
      className={cn(
        "relative flex h-[50px] w-full items-center justify-between border-b border-border pr-4 last:border-b-0",
        raceProgress === 100 && "rounded-md border-x border-t border-primary last:border-b",
      )}
    >
      <Track raceProgress={raceProgress} raceUser={raceUser} />

      <p className="flex h-full min-w-[80px] items-center justify-center whitespace-nowrap border-l border-border pl-4 text-sm text-muted-foreground">
        {wpm} WPM
      </p>
    </div>
  );
}
