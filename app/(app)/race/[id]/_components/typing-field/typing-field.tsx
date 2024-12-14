"use client";

import { useDisconnectOnUnload } from "@/hooks/use-disconnect-on-unload";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { useHandleUserProgress } from "../../hooks/use-handle-user-progress";
import { Caret } from "./caret";
import { useHandleKeydown } from "./use-handle-keydown";
import { Word } from "./word";

type Props = {
  text: string;
  userId: string;
  raceId: string;
};

const MemoWord = memo(Word);

export function TypingField({ text, userId, raceId }: Props) {
  const { currWordIndex, userWords, canType, hasMistake } = useTypingFieldStore();

  useHandleUserProgress(text, userId, raceId);

  useHandleKeydown(text);

  useDisconnectOnUnload(userId, raceId);

  return (
    <div
      className={cn(
        "relative flex w-full flex-wrap gap-2 rounded-lg border border-border p-6 font-geist-mono text-xl text-muted-foreground",
        !canType && "cursor-not-allowed opacity-30",
        hasMistake && "border-red-500",
      )}
    >
      <Caret />

      {text.split(" ").map((word, wordIndex) => (
        <MemoWord
          key={wordIndex}
          wordIndex={wordIndex}
          isBehind={wordIndex < currWordIndex}
          word={word}
          userWord={wordIndex <= currWordIndex ? userWords[wordIndex] : null}
        />
      ))}
    </div>
  );
}
