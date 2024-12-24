"use client";

import { handleRaceFinish } from "@/app/actions/handle-race-finish";
import { useRaceStore } from "@/hooks/zustand/use-race-store";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { supabase } from "@/lib/supabase/client";
import { Race } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useRaceProgress(raceDetails: Race, userId: string) {
  const [raceProgress, setRaceProgress] = useState(0);
  const [wpm, setWpm] = useState(0);

  const { raceStartedAt } = useRaceStore();
  const { setCanType } = useTypingFieldStore();

  const handleRaceComplete = useCallback(async () => {
    setCanType(false);
    const { error } = await handleRaceFinish(Date.now(), raceDetails.id);

    if (error) {
      toast.error(error);
    }
  }, [userId, raceDetails.id]);

  // Listen for broadcast updates to get the progress for user
  useEffect(() => {
    // join channel for this race
    const channel = supabase.channel(`race-${raceDetails.id}`, {
      config: {
        broadcast: { self: true },
      },
    });

    // listen for progress updates
    channel
      .on("broadcast", { event: "user-progress-update" }, (payload) => {
        // get the payload sent to this channel
        const { progress, userId: progressUpdateUserId } = payload.payload;

        // if the progress update is for the current user, update the race progress
        if (progressUpdateUserId === userId) {
          // if the progress is 100, handle the race complete
          if (progress === 100) {
            handleRaceComplete();
          }

          // update the race progress
          setRaceProgress(progress);

          // if the race has started, calculate the user's wpm
          if (raceStartedAt !== null) {
            const newWpm = calculateUserWpm(
              raceStartedAt,
              progress,
              raceDetails.text.split(" ").length,
            );

            setWpm(newWpm);
          }
        }
      })
      .subscribe();

    // cleanup
    return () => {
      channel.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [userId, raceDetails, handleRaceComplete, raceStartedAt]);

  return { raceProgress, wpm };
}

function calculateUserWpm(raceStartedAt: string, progress: number, totalWords: number) {
  const raceStartedAtDate = new Date(raceStartedAt + "Z");
  const raceDurationSec = (Date.now() - raceStartedAtDate.getTime()) / 1000;

  const wordsTyped = Math.round((progress / 100) * totalWords);

  const wpm = Math.round((wordsTyped / raceDurationSec) * 60);
  return wpm;
}
