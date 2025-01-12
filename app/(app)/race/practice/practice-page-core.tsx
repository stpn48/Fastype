"use client";

import { TypingField } from "@/app/(app)/race/_components/typing-field/typing-field";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { ResultsDialog } from "../../_components/results-dialog";
import { Toolbar } from "./_components/toolbar/toolbar";
import { useHandleRaceComplete } from "./hooks/use-handle-race-complete";
import { useHandleText } from "./hooks/use-handle-text";

export default function PracticeRacePageCore() {
  const { text } = useTypingFieldStore();

  const { raceCompleted, setRaceCompleted } = useHandleRaceComplete();

  const { generateText } = useHandleText(raceCompleted);

  return (
    <div className="flex h-full w-full flex-col items-center gap-4">
      <section className="flex h-fit w-full max-w-4xl flex-col items-center justify-center gap-12">
        <Toolbar generateText={generateText} />

        <TypingField text={text} />
      </section>

      {raceCompleted && (
        <ResultsDialog raceCompleted={raceCompleted} setRaceCompleted={setRaceCompleted} />
      )}
    </div>
  );
}
