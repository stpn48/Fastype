"use client";

import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { createClient } from "@supabase/supabase-js";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function Countdown() {
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
    toast.loading("Waiting for players...");

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const channel = supabase
      .channel("race-countdown")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "Race" }, (payload) => {
        if (payload.new.status === "closed") {
          toast.dismiss();
          setCountdown(5);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
