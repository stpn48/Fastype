import { handleRaceFinish } from "@/app/actions/handle-race-finish";
import { listenForRaceUpdates } from "@/lib/listen-for-race-updates";
import { Race } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useRaceProgress(raceDetails: Race, userId: string) {
  const [raceProgress, setRaceProgress] = useState(0);
  const [raceStartedAt, setRaceStartedAt] = useState<string | null>(null);
  const [wpm, setWpm] = useState(0);

  const handleRaceComplete = useCallback(async () => {
    const { error } = await handleRaceFinish(Date.now(), raceDetails.id);

    if (error) {
      toast.error(error);
    }
  }, [userId, raceDetails.id]);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const channel = supabase.channel(`race-${raceDetails.id}`, {
      config: {
        broadcast: { self: true },
      },
    });

    channel
      .on("broadcast", { event: "user-progress-update" }, (payload) => {
        const { progress, userId: progressUpdateUserId } = payload.payload;

        if (progressUpdateUserId === userId) {
          if (progress === 100) {
            handleRaceComplete();
          }

          setRaceProgress(progress);

          if (raceStartedAt !== null) {
            setWpm(calculateUserWpm(raceStartedAt, progress, raceDetails.text.split(" ").length));
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, raceDetails, handleRaceComplete, raceStartedAt]);

  // Listen for race updates to get the startedAt time
  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const channel = listenForRaceUpdates(supabase, raceDetails.id, (payload) => {
      console.log("payload", payload);
      if (payload.new.startedAt !== null) {
        setRaceStartedAt(payload.new.startedAt);
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [raceDetails.id]);

  return { raceProgress, wpm };
}

function calculateUserWpm(raceStartedAt: string, progress: number, totalWords: number) {
  const raceStartedAtDate = new Date(raceStartedAt + "Z");
  const raceDurationSec = (Date.now() - raceStartedAtDate.getTime()) / 1000;

  const wordsTyped = Math.round((progress / 100) * totalWords);

  const wpm = Math.round((wordsTyped / raceDurationSec) * 60);
  return wpm;
}
