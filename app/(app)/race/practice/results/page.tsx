"use client";

import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { Repeat } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

export default function RaceResultsPage() {
  const [time, setTime] = useState<string | null>(null);
  const { userWpm, totalMistakes, startedTypingAt, text, resetTypingFieldStore, setUserProgress } =
    useTypingFieldStore();

  const router = useRouter();

  // set user progress to 0 on mount to prevent being redirectaed back when click the back button in the browser
  useEffect(() => {
    setUserProgress(0);
  }, [setUserProgress]);

  const handlePlayAgainClick = useCallback(() => {
    router.push("/race/practice");
  }, [resetTypingFieldStore, router]);

  useEffect(() => {
    const duration = (new Date().getTime() - new Date(startedTypingAt || 0).getTime()) / 1000;
    setTime(duration.toFixed(0));
  }, [setTime, startedTypingAt]);

  return (
    <div className="flex h-full w-full items-center justify-center gap-20">
      <section className="flex flex-wrap gap-10 font-geist-mono">
        <Statiscic name="WPM" value={userWpm} />
        <Statiscic name="TIME" value={(time || "") + "s"} />
        <Statiscic name="MISTAKES" value={totalMistakes} />
        <Statiscic
          name="ACCURACCY"
          value={calculateAccuracy(totalMistakes, text.split(" ").join("").length) + "%"}
        />
      </section>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="h-fit" onClick={handlePlayAgainClick}>
            <Repeat />
          </TooltipTrigger>
          <TooltipContent>
            <p>Play again</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

function Statiscic({ name, value }: { name: string; value: number | string }) {
  return (
    <section className="flex w-fit flex-col items-center gap-1">
      <h1 className="text-2xl">{name}</h1>
      <p className="font-geist-mono text-7xl text-primary">{value}</p>
    </section>
  );
}

function calculateAccuracy(totalMistakes: number, totalChars: number) {
  if (totalChars === 0) return "0"; // Handle edge case where totalChars is 0
  const accuracy = (1 - totalMistakes / totalChars) * 100;
  return accuracy.toFixed(0); // Round to nearest whole number as a string
}
