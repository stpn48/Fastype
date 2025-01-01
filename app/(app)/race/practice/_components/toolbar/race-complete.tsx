"use client";

import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { useCallback, useEffect, useState } from "react";

type Props = {
  hideStats: () => void;
};

export function RaceComplete({ hideStats }: Props) {
  const [time, setTime] = useState<string | null>(null);
  const { userWpm, totalMistakes, startedTypingAt, text, resetTypingFieldStore } =
    useTypingFieldStore();

  const handlePlayAgainClick = useCallback(() => {
    resetTypingFieldStore();
    hideStats();
  }, [hideStats, resetTypingFieldStore]);

  useEffect(() => {
    const duration = (new Date().getTime() - new Date(startedTypingAt || 0).getTime()) / 1000;
    setTime(duration.toFixed(0));
  }, [setTime, startedTypingAt]);

  return (
    <div className="flex w-full justify-between">
      <section className="flex flex-col gap-8 font-geist-mono">
        <Statiscic name="WPM" value={userWpm} />
        <Statiscic name="MISTAKES" value={totalMistakes} />
        <Statiscic
          name="ACCURACCY"
          value={calculateAccuracy(totalMistakes, text.split(" ").join("").length) + "%"}
        />
        <Statiscic name="TIME" value={(time || "") + "s"} />
      </section>

      <button onClick={handlePlayAgainClick}>play again</button>
    </div>
  );
}

function Statiscic({ name, value }: { name: string; value: number | string }) {
  return (
    <section className="flex flex-col gap-1">
      <h1 className="text-2xl">{name}</h1>
      <p className="font-geist-mono text-7xl text-primary">{value}</p>
    </section>
  );
}

function calculateAccuracy(totalMistakes: number, totalChars: number) {
  const onePercent = totalChars / 100;
  return (100 - onePercent * totalMistakes).toFixed(0);
}
