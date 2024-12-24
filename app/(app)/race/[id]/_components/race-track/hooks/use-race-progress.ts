import { handleRaceFinish } from "@/app/actions/handle-race-finish";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { listenForRaceUpdates } from "@/lib/listen-for-race-updates";
import { Race } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useRaceProgress(raceDetails: Race, userId: string) {
  const [raceProgress, setRaceProgress] = useState(0);
  const [raceStartedAt, setRaceStartedAt] = useState<string | null>(null);
  const [wpm, setWpm] = useState(0);

  const { setCanType } = useTypingFieldStore();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleRaceComplete = useCallback(async () => {
    setCanType(false);
    const { error } = await handleRaceFinish(Date.now(), raceDetails.id);

    if (error) {
      toast.error(error);
    }
  }, [userId, raceDetails.id]);

  // Listen for broadcast updates to get the progress for user
  useEffect(() => {
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
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("subscribed to channel, listening for progress updates");
        }
      });

    return () => {
      channel.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [userId, raceDetails, handleRaceComplete, raceStartedAt, supabase]);

  // Listen for race updates to get the startedAt time
  useEffect(() => {
    const channel = listenForRaceUpdates(supabase, raceDetails.id, (payload) => {
      console.log("payload", payload);
      if (payload.new.startedAt !== null) {
        setRaceStartedAt(payload.new.startedAt);
      }
    });

    return () => {
      channel.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [raceDetails.id, supabase]);

  return { raceProgress, wpm };
}

function calculateUserWpm(raceStartedAt: string, progress: number, totalWords: number) {
  const raceStartedAtDate = new Date(raceStartedAt + "Z");
  const raceDurationSec = (Date.now() - raceStartedAtDate.getTime()) / 1000;

  const wordsTyped = Math.round((progress / 100) * totalWords);

  const wpm = Math.round((wordsTyped / raceDurationSec) * 60);
  return wpm;
}
