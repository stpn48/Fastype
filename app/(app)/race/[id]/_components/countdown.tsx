"use client";

import { updateRaceStartedAt } from "@/app/actions/update-race-started-at";
import { useRaceStore } from "@/hooks/zustand/use-race-store";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { RaceType } from "@prisma/client";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Props = {
  raceType: RaceType;
  raceId: string;
};

export function Countdown({ raceType, raceId }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  const { countdown, setCountdown } = useRaceStore();

  const { setCanType } = useTypingFieldStore();

  const intervalId = useRef<NodeJS.Timeout>();

  // start countdown when countdown is set
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

  // handle countdown end
  useEffect(() => {
    if (countdown === 0) {
      const asyncUpdateRaceStartedAt = async () => {
        const { error } = await updateRaceStartedAt(raceId, new Date());

        if (error) {
          toast.error(error.message);
        }
      };

      clearInterval(intervalId.current);
      setCanType(true);

      asyncUpdateRaceStartedAt();
    }
  }, [countdown, raceId]);

  // handle countdown start for solo and show toast for public and private races
  useEffect(() => {
    setIsMounted(true);

    // solo race start countdown instantly
    if (raceType === "solo") {
      setCountdown(3);
      return;
    }

    // show toast if race is public or private
    if (raceType === "public" || raceType === "private") {
      if (isMounted) {
        toast.info("Waiting for players...");
      }
    }
  }, [raceType, isMounted]);

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
