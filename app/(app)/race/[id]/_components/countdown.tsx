"use client";

import { updateRaceStartedAt } from "@/app/actions/update-rece-started-at";
import { useRaceStore } from "@/hooks/zustand/use-race-store";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { race_type } from "@prisma/client";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Props = {
  raceType: race_type;
  raceId: string;
};

export function Countdown({ raceType, raceId }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  const { countdown, setCountdown, setRaceStartedAt } = useRaceStore();

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
        const raceStartedAt = new Date();

        setRaceStartedAt(raceStartedAt);
        const { error } = await updateRaceStartedAt(raceId, raceStartedAt);

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

    if (isMounted) {
      toast.info("Waiting for players...");
    }
  }, [raceType, isMounted]);

  if (countdown === null) return null;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-20 flex h-screen w-screen items-center justify-center">
        <motion.span
          key={countdown}
          className="z-50 font-geist-sans text-[120px] font-bold text-foreground"
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
