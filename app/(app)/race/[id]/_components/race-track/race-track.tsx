"use client";

import { getRaceUsers } from "@/app/actions/get-race-usesr";
import { createClient } from "@/lib/supabase/client";
import { Race } from "@prisma/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { use, useCallback, useEffect, useState } from "react";
import { UserTrack } from "./user-track";

type Props = {
  raceId: string;
  initialRaceUsers: RaceUser[];
};

export type RaceUser = {
  id: string;
  clerkId: string;
  imageUrl: string | null;
  firstName: string | null;
  lastName: string | null;
};

export function RaceTrack({ raceId, initialRaceUsers }: Props) {
  const [raceUsers, setRaceUsers] = useState<RaceUser[]>(initialRaceUsers);

  const supabase = createClient();

  const getRaceParticipants = useCallback(
    async (raceId: string) => {
      const raceUsers = await getRaceUsers(raceId);

      if (!raceUsers) {
        return;
      }

      setRaceUsers(raceUsers);
    },
    [setRaceUsers],
  );

  useEffect(() => {
    const channel = supabase
      .channel("user-progress")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Race",
          filter: `id=eq.${raceId}`,
        },
        async (payload: RealtimePostgresChangesPayload<Race>) => {
          if (payload.errors) {
            return;
          }
          // get raceUsers for this race raceId === payload.new.id

          if (payload.new && "id" in payload.new) {
            getRaceParticipants(payload.new.id);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  return (
    <div className="flex w-full flex-col rounded-lg border border-border">
      {raceUsers.map((raceUser) => (
        <UserTrack key={raceUser.id} raceUser={raceUser} />
      ))}
    </div>
  );
}
