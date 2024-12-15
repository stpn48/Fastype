"use client";

import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { RaceType } from "@prisma/client";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Props = {
  raceType: RaceType;
};

export function Countdown({ raceType }: Props) {
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

    // public races wait for race status to change to closed, 15 sec (waiting for players)
    if (raceType === "public") {
      toast.loading("Waiting for players...");

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );

      const channel = listedForRaceUpdates(supabase, () => {
        toast.dismiss();
        setCountdown(5);
      });

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [raceType]);

  if (countdown === null) return null;

  return (
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
  );
}

function listedForRaceUpdates(
  supabase: SupabaseClient<any, "public", any>,
  onRaceClose: () => void,
) {
  const channel = supabase
    .channel("race-countdown")
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "Race" }, (payload) => {
      if (payload.new.status === "closed") {
        onRaceClose();
      }
    })
    .subscribe();

  return channel;
}
