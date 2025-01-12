"use client";

import { ResultsDialog } from "@/app/(app)/_components/results-dialog";
import { handleRaceFinish } from "@/app/actions/handle-race-finish";
import { UserAvatarProfileLink } from "@/components/user-avatar-profile-link";
import { useRaceStore } from "@/hooks/zustand/use-race-store";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { cn } from "@/lib/utils";
import { RaceUser } from "@/types/types";
import { useEffect, useState } from "react";

type Props = {
  userId: string;
  raceUser: RaceUser;
  raceProgress: number;
};

export function UserTrack({ userId, raceUser, raceProgress }: Props) {
  const { currPlace, setCurrPlace, setRaceCompleted, raceCompleted } = useRaceStore();
  const { setCanType, userWpm } = useTypingFieldStore();

  const [userPlace, setUserPlace] = useState<number | null>(null);

  useEffect(() => {
    if (raceProgress === 100 && userPlace === null) {
      // do this only for the user that has finished the race, not for everyone. IMPORTANT
      if (raceUser.id === userId) {
        setRaceCompleted(true);
        setCanType(false);
        (async () => {
          await handleRaceFinish(userWpm);
        })();
      }

      // do this for everybody
      setUserPlace(currPlace);
      setCurrPlace((prev) => prev + 1);
    }
  }, [raceUser.id, userId, raceProgress, currPlace, userPlace, userWpm]);

  return (
    <div
      className={cn(
        "relative flex h-[50px] w-full items-center justify-between border-b border-border pr-4 last:border-b-0",
        raceProgress === 100 && "rounded-md border-x border-t border-primary last:border-b",
      )}
    >
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

        <UserAvatarProfileLink
          id={raceUser.id}
          username={raceUser.username}
          image_url={raceUser.image_url}
        />
      </div>

      {raceCompleted && (
        <ResultsDialog raceCompleted={raceCompleted} setRaceCompleted={setRaceCompleted} />
      )}
    </div>
  );
}
