"use client";

import { handleRaceFinish } from "@/app/actions/handle-race-finish";
import { useRaceStore } from "@/hooks/zustand/use-race-store";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { supabaseJsClient } from "@/lib/supabase/client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useRaceProgress(raceId: string, raceText: string, userId: string) {
  const [raceProgress, setRaceProgress] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [userPlace, setUserPlace] = useState<number | null>(null);

  const { currPlace, setCurrPlace } = useRaceStore();
  const { setCanType, startedTypingAt } = useTypingFieldStore();

  const handleRaceComplete = useCallback(async () => {
    setCanType(false);
    const { error } = await handleRaceFinish(raceId, wpm);

    if (error) {
      toast.error(error);
    }
  }, [userId, raceId, wpm]);

  useEffect(() => {
    if (raceProgress === 100) {
      setUserPlace(currPlace);
      setCurrPlace((prev) => prev + 1);
    }
  }, [raceProgress]);

  // Listen for broadcast updates to get the progress for user
  useEffect(() => {
    // join channel for this race
    const channel = supabaseJsClient.channel(`race-${raceId}`, {
      config: {
        broadcast: { self: true },
      },
    });

    // listen for progress updates with supabase broadcast
    channel
      .on("broadcast", { event: "user-progress-update" }, (payload) => {
        // get the payload sent to this channel
        const { progress, userId: progressUpdateUserId } = payload.payload;

        // if the progress update is for the current user, update the race progress
        if (progressUpdateUserId === userId) {
          // if the progress is 100, handle the race complete
          if (progress === 100) {
            channel.unsubscribe();
            supabaseJsClient.removeChannel(channel);
            handleRaceComplete();
          }

          // update the race progress
          setRaceProgress(progress);

          // if the race has started, calculate the user's wpm
          if (startedTypingAt !== null) {
            const newWpm = calculateUserWpm(startedTypingAt, progress, raceText.split(" ").length);
            setWpm(newWpm);
          }
        }
      })
      .subscribe();

    // cleanup
    return () => {
      channel.unsubscribe();
      supabaseJsClient.removeChannel(channel);
    };
  }, [userId, raceText, handleRaceComplete, startedTypingAt]);

  return { raceProgress, wpm, userPlace };
}

export function calculateUserWpm(raceStartedAt: string, progress: number, totalWords: number) {
  const raceStartedAtDate = new Date(
    raceStartedAt[raceStartedAt.length - 1] === "Z" ? raceStartedAt : `${raceStartedAt}Z`,
  );
  const raceDurationSec = (Date.now() - raceStartedAtDate.getTime()) / 1000;

  const lettersTyped = Math.round((progress / 100) * totalWords);

  const wpm = Math.round((lettersTyped / raceDurationSec) * 60);
  return wpm;
}
