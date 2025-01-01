"use client";

import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { cn } from "@/lib/utils";
import { memo, useEffect } from "react";
import { Caret } from "../[id]/_components/typing-field/caret";
import { useHandleKeydown } from "../[id]/_components/typing-field/use-handle-keydown";
import { Word } from "../[id]/_components/typing-field/word";
import { useHandleUserProgress } from "../[id]/hooks/use-handle-user-progress";

type Props = {
  text: string;
  userId?: string;
  raceId?: string;
  canTypeLock?: boolean;
};

const MemoWord = memo(Word);

export function TypingField({ text, userId, raceId, canTypeLock }: Props) {
  const { currWordIndex, userWords, canType, hasMistake, isLoading, resetTypingFieldStore } =
    useTypingFieldStore();

  useHandleUserProgress(text, userId, raceId);

  useHandleKeydown(text, canTypeLock);

  // reset typing field store on mount to prevent leftover state
  useEffect(() => {
    resetTypingFieldStore();
  }, [resetTypingFieldStore]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col gap-4 rounded-lg border border-border p-6">
        <div className="h-[18px] w-full animate-pulse rounded-sm bg-secondary" />
        <div className="h-[18px] w-full animate-pulse rounded-sm bg-secondary" />
        <div className="h-[18px] w-[60%] animate-pulse rounded-sm bg-secondary" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex w-full flex-wrap gap-2 rounded-lg border border-border p-6 font-geist-mono text-xl text-muted-foreground shadow-lg",
        !canType && !canTypeLock && "cursor-not-allowed opacity-30",
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
