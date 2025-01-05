"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function useRaceProgress(raceId: string) {
  const [progresses, setProgresses] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    // join channel for this race
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const channel = supabase.channel(`race-${raceId}`, {
      config: {
        broadcast: { self: true },
      },
    });

    // listen for progress updates with supabase broadcast
    channel
      .on("broadcast", { event: "user-progress-update" }, (payload) => {
        // get the payload sent to this channel
        const { progress, userId: updateForUserId } = payload.payload;

        setProgresses((prev) => {
          const updatedProgresses = { ...prev };
          updatedProgresses[updateForUserId] = progress || 0;
          return updatedProgresses;
        });
      })
      .subscribe();

    // cleanup
    return () => {
      channel.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [raceId]);

  return { progresses };
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
