"use client";

import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { cn } from "@/lib/utils";
import { memo, useEffect } from "react";
import { useHandleUserProgress } from "../../[id]/hooks/use-handle-user-progress";
import { Caret } from "./caret";
import { SettingsPopover } from "./settings-popover/settings-popover";
import { useHandleKeydown } from "./use-handle-keydown";
import { useHandleUserConfig } from "./use-handle-user-config";
import { Word } from "./word";

type Props = {
  text: string;
  userId?: string;
  raceId?: string;
};

const MemoWord = memo(Word);

export function TypingField({ text, userId, raceId }: Props) {
  const {
    currWordIndex,
    userWords,
    canType,
    hasMistake,
    isLoading,
    resetTypingFieldStore,
    isTyping,
    startedTypingAt,
    fontSize,
    isLoadingUserConfig,
  } = useTypingFieldStore();

  useHandleUserProgress(text, userId, raceId);

  useHandleKeydown(text);

  useHandleUserConfig();

  // reset typing field store on mount to prevent leftover state
  useEffect(() => {
    resetTypingFieldStore();
  }, [resetTypingFieldStore]);

  if (isLoading || isLoadingUserConfig) {
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
        "relative flex w-full flex-wrap gap-2 rounded-lg border border-border p-6 font-geist-mono text-muted-foreground shadow-lg",
        !canType && "cursor-not-allowed opacity-30",
        hasMistake && "border-red-500",
      )}
      style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize || 0 / 1.5}px` }}
    >
      {isTyping && <Caret />}

      {text.split(" ").map((word, wordIndex) => (
        <MemoWord
          key={wordIndex}
          wordIndex={wordIndex}
          isBehind={wordIndex < currWordIndex}
          word={word}
          userWord={wordIndex <= currWordIndex ? userWords[wordIndex] : null}
        />
      ))}

      {!startedTypingAt && <SettingsPopover />}
    </div>
  );
}
