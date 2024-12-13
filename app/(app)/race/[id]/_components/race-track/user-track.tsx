"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRaceProgress } from "./hooks/use-race-progress";
import { RaceUser } from "./hooks/use-race-users";

type Props = {
  raceUser: RaceUser;
  raceId: string;
};

export function UserTrack({ raceUser, raceId }: Props) {
  const { raceProgress } = useRaceProgress(raceId, raceUser.id);

  return (
    <div className="relative flex h-[50px] w-full items-center border-b border-border last:border-b-0">
      <div
        className="flex min-w-fit justify-end px-4 transition-all"
        style={{ width: `${raceProgress}%` }}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={raceUser.imageUrl ?? ""} />
          <AvatarFallback>
            {raceUser.firstName?.charAt(0) ?? "U"}
            {raceUser.lastName?.charAt(0) ?? "N"}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
