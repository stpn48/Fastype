"use client";

import { motion } from "motion/react";

type Props = {
  countdown: number;
};

export function Countdown({ countdown }: Props) {
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
