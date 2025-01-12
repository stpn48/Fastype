"use client";

import { TypingField } from "@/app/(app)/race/_components/typing-field/typing-field";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { useEffect, useState } from "react";
import { Toolbar } from "./_components/toolbar/toolbar";
import { ToolbarProvider } from "./hooks/use-toolbar";

export function PracticeRaceCore() {
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
  }, [setCanType]);

  if (raceCompleted) {
    return <div>Race Completed</div>;
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
