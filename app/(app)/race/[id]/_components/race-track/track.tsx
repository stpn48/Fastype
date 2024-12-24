"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RaceUser } from "@/types/types";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useUserPlace } from "./hooks/use-user-place";

type Props = {
  raceProgress: number;
  raceUser: RaceUser;
};

export function Track({ raceProgress, raceUser }: Props) {
  const { userPlace } = useUserPlace(raceProgress);
  const router = useRouter();

  const handleAvatarClick = useCallback(() => {
    router.push(`/profile/${raceUser.id}`);
  }, [raceUser.id, router]);

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

        <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80" onClick={handleAvatarClick}>
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
