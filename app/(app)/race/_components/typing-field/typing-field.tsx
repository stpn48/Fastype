"use client";

import { useRaceStore } from "@/hooks/zustand/use-race-store";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { cn } from "@/lib/utils";
import { font_family } from "@prisma/client";
import { memo, useEffect } from "react";
import { useHandleUserProgress } from "../../[id]/hooks/use-handle-user-progress";
import { Caret } from "./caret";
import { useHandleKeydown } from "./hooks/use-handle-keydown";
import { useHandleUserConfig } from "./hooks/use-handle-user-config";
import { SettingsPopover } from "./settings-popover/settings-popover";
import { getFontFamilyTwClass } from "./utils/get-font-family-tw-class";
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
    fontFamily,
    smoothCaret,
  } = useTypingFieldStore();

  const { raceStartedAt, resetRaceStore } = useRaceStore();

  const isPracticeMode = !raceId || !userId;

  useHandleUserProgress(text, userId, raceId);

  useHandleKeydown(text);

  useHandleUserConfig();

  // reset typing field store on mount to prevent leftover state
  useEffect(() => {
    resetTypingFieldStore();
    resetRaceStore();
  }, [resetTypingFieldStore, resetRaceStore]);

  if (isLoading || fontFamily === null || fontSize === null || smoothCaret === null) {
    return (
      <div className="flex h-full w-full flex-col gap-4 rounded-lg border border-border p-6">
        <div className="h-[18px] w-full animate-pulse rounded-sm bg-secondary" />
        <div className="h-[18px] w-full animate-pulse rounded-sm bg-secondary" />
        <div className="h-[18px] w-[60%] animate-pulse rounded-sm bg-secondary" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-end gap-5">
      <div
        className={cn(
          "flex w-full flex-wrap gap-2 rounded-lg border border-border p-6 text-muted-foreground shadow-lg",
          !canType && "cursor-not-allowed opacity-30",
          hasMistake && "border-red-500",
          getFontFamilyTwClass(fontFamily as font_family),
        )}
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: `${fontSize || 0 / 1.5}px`,
        }}
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
      </div>
      {!startedTypingAt && !raceStartedAt && <SettingsPopover isPracticeMode={isPracticeMode} />}
    </div>
  );
}
