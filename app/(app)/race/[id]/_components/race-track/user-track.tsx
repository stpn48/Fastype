"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Race } from "@prisma/client";
import { useRaceProgress } from "./hooks/use-race-progress";
import { RaceUser } from "./hooks/use-race-users";

type Props = {
  raceDetails: Race & { users: RaceUser[] };
  raceUser: RaceUser;
};

export function UserTrack({ raceDetails, raceUser }: Props) {
  const { raceProgress, wpm } = useRaceProgress(raceDetails, raceUser.id);

  return (
    <div className="relative flex h-[50px] w-full items-center justify-between border-b border-border px-4 last:border-b-0">
      <div
        className="flex min-w-fit justify-end pr-4 transition-all"
        style={{ width: `${raceProgress}%` }}
      >
        <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80">
          <AvatarImage src={raceUser.imageUrl ?? ""} />
          <AvatarFallback>
            {raceUser.firstName?.charAt(0) ?? "U"}
            {raceUser.lastName?.charAt(0) ?? "N"}
          </AvatarFallback>
        </Avatar>
      </div>
      <p className="flex h-full min-w-[80px] items-center justify-center whitespace-nowrap border-l border-border pl-4 text-sm text-muted-foreground">
        {wpm} WPM
      </p>
    </div>
  );
}
