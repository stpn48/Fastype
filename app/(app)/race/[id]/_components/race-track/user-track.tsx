"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Race } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRaceProgress } from "./hooks/use-race-progress";
import { RaceUser } from "./hooks/use-race-users";

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
      <div className="flex-1">
        <div
          className="flex min-w-fit justify-end px-4 transition-all"
          style={{ width: `${raceProgress}%` }}
        >
          {raceProgress === 100 && (
            <p className="mr-4 flex items-center justify-center text-sm text-muted-foreground">
              {userPlace}
              {userPlace === 1 ? "st" : userPlace === 2 ? "nd" : userPlace === 3 ? "rd" : "th"}
            </p>
          )}
          <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80">
            <AvatarImage src={raceUser.imageUrl ?? ""} />
            <AvatarFallback>
              {raceUser.firstName?.charAt(0) ?? "U"}
              {raceUser.lastName?.charAt(0) ?? "N"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <p className="flex h-full min-w-[80px] items-center justify-center whitespace-nowrap border-l border-border pl-4 text-sm text-muted-foreground">
        {wpm} WPM
      </p>
    </div>
  );
}
