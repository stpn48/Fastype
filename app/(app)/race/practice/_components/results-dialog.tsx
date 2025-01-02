"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useEffect, useState } from "react";
import { calculateAccuracy } from "../utils/calculate-accuracy";
import { Statistic } from "./statistic";

type Props = {
  raceCompleted: boolean;
  setRaceCompleted: (value: boolean) => void;
};

export function ResultsDialog({ raceCompleted, setRaceCompleted }: Props) {
  const [time, setTime] = useState<string | null>(null);

  const { userWpm, totalMistakes, startedTypingAt, text, resetTypingFieldStore, setUserProgress } =
    useTypingFieldStore();

  useEffect(() => {
    const duration = (new Date().getTime() - new Date(startedTypingAt || 0).getTime()) / 1000;
    setTime(duration.toFixed(0));
  }, [startedTypingAt]);

  return (
    <Dialog open={raceCompleted} onOpenChange={setRaceCompleted}>
      <DialogContent className="flex max-w-fit flex-col gap-10 p-20">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Results</DialogTitle>
            <DialogDescription>Here are your results</DialogDescription>
          </DialogHeader>
        </VisuallyHidden>

        <section className="flex justify-center gap-10">
          <Statistic name="WPM" value={userWpm} />
          <Statistic name="TIME" value={(time || "") + "s"} />
          <Statistic name="MISTAKES" value={totalMistakes} />
          <Statistic
            name="ACCURACY"
            value={calculateAccuracy(totalMistakes, text.split(" ").join("").length) + "%"}
          />
        </section>
      </DialogContent>
    </Dialog>
  );
}
