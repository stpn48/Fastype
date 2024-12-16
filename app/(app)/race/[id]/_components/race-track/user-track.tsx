"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Race } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useRaceProgress } from "./hooks/use-race-progress";
import { RaceUser } from "./hooks/use-race-users";

type Props = {
  raceDetails: Race & { users: RaceUser[] };
  raceUser: RaceUser;
};

export function UserTrack({ raceDetails, raceUser }: Props) {
  const { raceProgress } = useRaceProgress(raceDetails.id, raceUser.id, raceDetails.type);

  return (
    <div className="relative flex h-[50px] w-full items-center border-b border-border last:border-b-0">
      <div
        className="flex min-w-fit justify-end px-4 transition-all"
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
    </div>
  );
}
