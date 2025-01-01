"use client";

import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { useEffect, useState } from "react";
import { TypingField } from "@/app/(app)/race/_components/typing-field";
import { ToolbarProvider } from "./hooks/use-toolbar";
import { Toolbar } from "./_components/toolbar/toolbar";
import { RaceComplete } from "./_components/toolbar/race-complete";

export default function PracticeRacePage() {
  const [raceCompleted, setRaceCompleted] = useState(false);

  const { setCanType, text, userProgress } = useTypingFieldStore();

  useEffect(() => {
    if (userProgress === 100) {
      setRaceCompleted(true);
      setCanType(false);
    }
  }, [userProgress]);

  useEffect(() => {
    setCanType(true);

    return () => {
      setRaceCompleted(false);
    };
  }, []);

  if (raceCompleted) {
    return <RaceComplete hideStats={() => setRaceCompleted(false)} />;
  }

  return (
    <div className="flex h-full w-full flex-col items-center gap-4">
      <section className="flex h-fit w-full max-w-4xl flex-col items-center justify-center gap-12">
        <ToolbarProvider>
          <Toolbar />
        </ToolbarProvider>

        <TypingField text={text} />
      </section>
    </div>
  );
}
