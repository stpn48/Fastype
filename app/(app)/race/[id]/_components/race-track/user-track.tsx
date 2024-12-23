"use client";

import { cn } from "@/lib/utils";
import { Race } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRaceProgress } from "./hooks/use-race-progress";
import { RaceUser } from "./hooks/use-race-users";
import { Track } from "./track";

type Props = {
  raceDetails: Race & { users: RaceUser[] };
  raceUser: RaceUser;
  place: number;
  setPlace: (place: number) => void;
};

export function UserTrack({ raceDetails, raceUser, place, setPlace }: Props) {
  const [userPlace, setUserPlace] = useState<number>(place);

  const { raceProgress, wpm } = useRaceProgress(raceDetails, raceUser.id);

  useEffect(() => {
    if (raceProgress === 100) {
      setUserPlace(place);
      setPlace(place + 1);
    }
  }, [raceProgress]);

  return (
    <div
      className={cn(
        "relative flex h-[50px] w-full items-center justify-between border-b border-border pr-4 last:border-b-0",
        raceProgress === 100 && "rounded-md border-x border-t border-primary last:border-b",
      )}
    >
      <Track raceProgress={raceProgress} userPlace={userPlace} raceUser={raceUser} />

      <p className="flex h-full min-w-[80px] items-center justify-center whitespace-nowrap border-l border-border pl-4 text-sm text-muted-foreground">
        {wpm} WPM
      </p>
    </div>
  );
}
