"use client";

import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { RaceType } from "@prisma/client";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { StartRaceButton } from "./start-race-button";

type Props = {
  raceType: RaceType;
  isAuthor: boolean;
  raceId: string;
};

export function Countdown({ raceType, isAuthor, raceId }: Props) {
  const [countdown, setCountdown] = useState<number | null>(null);

  const { setCanType } = useTypingFieldStore();

  const intervalId = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (countdown === null) return;

    intervalId.current = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (!prevCountdown) return prevCountdown;

        return prevCountdown - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId.current);
    };
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0) {
      clearInterval(intervalId.current);
      setCanType(true);
    }
  }, [countdown]);

  useEffect(() => {
    // solo race start countdown instantly
    if (raceType === "solo") {
      setCountdown(3);
      return;
    }

    // public and private races wait for race status to change to closed
    if (raceType === "public" || raceType === "private") {
      toast.loading("Waiting for players...");

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );

      const channel = listenForRaceUpdates(
        supabase,
        () => {
          toast.dismiss();
          setCountdown(5);
        },
        raceId,
      );

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [raceType, raceId]);

  if (countdown === null && raceType === "private" && isAuthor)
    return <StartRaceButton raceId={raceId} />;

  if (countdown === null) return null;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-20 flex h-screen w-screen items-center justify-center">
        <motion.span
          key={countdown}
          className="z-50 font-geist-sans text-[120px] font-bold text-white"
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {countdown}
        </motion.span>
      </div>
    </>
  );
}

function listenForRaceUpdates(
  supabase: SupabaseClient<any, "public", any>,
  onRaceClose: () => void,
  raceId: string,
) {
  const channel = supabase
    .channel("race-updates")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "Race", filter: `id=eq.${raceId}` },
      (payload) => {
        if (payload.new.status === "closed") {
          onRaceClose();
        }
      },
    )
    .subscribe();

  return channel;
}
