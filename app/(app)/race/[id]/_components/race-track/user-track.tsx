"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { RaceUser } from "./use-race-users";

type Props = {
  raceUser: RaceUser;
  raceId: string;
};

export function UserTrack({ raceUser, raceId }: Props) {
  const [raceProgress, setRaceProgress] = useState(0);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const channel = supabase.channel(`race-${raceId}`, {
      config: {
        broadcast: { self: true },
      },
    });

    channel
      .on("broadcast", { event: "user-progress-update" }, (payload) => {
        const { progress, userId } = payload.payload;

        console.log("payload received", payload);

        if (userId === raceUser.id) {
          setRaceProgress(progress);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [raceUser.id, raceId]);

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
