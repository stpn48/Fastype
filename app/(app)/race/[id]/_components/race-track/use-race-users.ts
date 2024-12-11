import { getRaceUsers } from "@/app/actions/get-race-usesr";
import { useRace } from "@/hooks/zustand/use-race";
import { Race, RaceStatus } from "@prisma/client";
import { RealtimePostgresChangesPayload, SupabaseClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export type RaceUser = {
  id: string;
  clerkId: string;
  imageUrl: string | null;
  firstName: string | null;
  lastName: string | null;
};

export function useRaceUsers(
  supabase: SupabaseClient<any, "public", any>,
  raceId: string,
  initialRaceUsers: RaceUser[],
  raceStatus: RaceStatus,
) {
  const [raceUsers, setRaceUsers] = useState<RaceUser[]>(initialRaceUsers);
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);

  const intervalId = useRef<NodeJS.Timeout>();

  const { setCanType, resetRaceStore } = useRace();

  const getRaceParticipants = useCallback(
    async (raceId: string) => {
      const raceUsers = await getRaceUsers(raceId);

      if (!raceUsers) {
        toast.error("Error getting race users");
        return;
      }

      //TODO: Remove this toast, for testing now
      toast.success("Successfully got race users");
      setRaceUsers(raceUsers);
    },
    [setRaceUsers],
  );

  const handleRaceTableUpdate = useCallback(
    async (payload: RealtimePostgresChangesPayload<Race>) => {
      if (payload.errors) {
        toast.error("Error getting race updates");
        return;
      }

      if (payload.new && "id" in payload.new) {
        getRaceParticipants(payload.new.id);
      }

      // when race closes, start 3 second countdown
      if (payload.new && "status" in payload.new && payload.new.status === "closed") {
        setShowCountdown(true);
        intervalId.current = setInterval(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);
      }
    },
    [getRaceParticipants],
  );

  // handle initial canType
  useEffect(() => {
    if (raceStatus === "closed") {
      setCanType(true);
    }
  }, [raceStatus]);

  // handle ending countdown
  useEffect(() => {
    if (countdown <= 0) {
      clearInterval(intervalId.current);
      setShowCountdown(false);
      setCanType(true);
    }
  }, [countdown]);

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
        handleRaceTableUpdate,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);

      if (intervalId.current) {
        clearInterval(intervalId.current);
      }

      resetRaceStore();
    };
  }, []);

  return { raceUsers, countdown, showCountdown };
}
