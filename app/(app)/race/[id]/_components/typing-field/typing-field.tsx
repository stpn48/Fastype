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
  const { currWordIndex, currCharIndex, userWords, canType } = useTypingFieldStore();
  useHandleUserProgress(text, userId, raceId);

  useHandleKeydown(text);

  useDisconnectOnUnload(userId, raceId);

  return (
    <div
      className={cn(
        "relative flex w-full flex-wrap rounded-lg border border-border p-6 font-geist-mono text-xl text-muted-foreground",
        !canType && "cursor-not-allowed opacity-30",
      )}
    >
      <Caret currCharIndex={currCharIndex} currWordIndex={currWordIndex} />

      {text.split(" ").map((word, wordIndex) => (
        <MemoWord
          key={wordIndex}
          isActive={wordIndex === currWordIndex}
          word={word}
          wordIndex={wordIndex}
          userWord={wordIndex <= currWordIndex ? userWords[wordIndex] : null}
        />
      ))}
    </div>
  );
}
