import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { RaceUser } from "./hooks/use-race-users";

type Props = {
  raceProgress: number;
  userPlace: number;
  raceUser: RaceUser;
};

export function Track({ raceProgress, userPlace, raceUser }: Props) {
  return (
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
  );
}
