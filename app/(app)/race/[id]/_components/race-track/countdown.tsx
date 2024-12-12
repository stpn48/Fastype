"use client";

import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function Countdown() {
  const [countdown, setCountdown] = useState(20);

  const { setCanType } = useTypingFieldStore();

  const intervalId = useRef<NodeJS.Timeout>();

  useEffect(() => {
    intervalId.current = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => {
      clearInterval(intervalId.current);
    };
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      clearInterval(intervalId.current);
      setCanType(true);
    }
  }, [countdown]);

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
