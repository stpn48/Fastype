import { getRaceUsers } from "@/app/actions/get-race-usesr";
import { createClient } from "@/lib/supabase/client";
import { Race } from "@prisma/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export type RaceUser = {
  id: string;
  clerkId: string;
  imageUrl: string | null;
  firstName: string | null;
  lastName: string | null;
};

export function useRaceUsers(raceId: string, initialRaceUsers: RaceUser[]) {
  const [raceUsers, setRaceUsers] = useState<RaceUser[]>(initialRaceUsers);

  const supabase = createClient();

  const getRaceParticipants = useCallback(async (raceId: string) => {
    const raceUsers = await getRaceUsers(raceId);

    if (!raceUsers) {
      toast.error("Error getting race users");
      return;
    }

    setRaceUsers(raceUsers);
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("listen-for-race-inserts")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Race",
          filter: `id=eq.${raceId}`,
        },
        async (payload: RealtimePostgresChangesPayload<Race>) => {
          const newRace = payload.new as RaceUser;
          await getRaceParticipants(newRace.id);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { raceUsers };
}
