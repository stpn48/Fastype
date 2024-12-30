"use client";

import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { useEffect } from "react";
import { TypingField } from "../_components/typing-field";
import { Toolbar } from "./_components/toolbar";

export function PracticeRaceCore() {
  const { setCanType, text } = useTypingFieldStore();

  // const { } = useRaceText();

  useEffect(() => {
    setCanType(true);
  }, [setCanType]);

  return (
    <div className="flex h-fit flex-col items-center justify-center gap-12">
      <Toolbar />
      <TypingField text={text} />
    </div>
  );
}
