"use client";

import { cn } from "@/lib/utils";
import { memo } from "react";
import { Char } from "./char";

type Props = {
  word: string;
  userWord: string | null;
  isBehind: boolean;
  wordIndex: number;
};

const MemoChar = memo(Char);

export function Word({ word, userWord, isBehind, wordIndex }: Props) {
  const hasMistake = isBehind && userWord !== word;

  return (
    <span
      className={cn(
        "h-fit",
        `word-${wordIndex}`,
        hasMistake && "underline decoration-destructive decoration-2 underline-offset-4",
      )}
    >
      {word.split("").map((char, charIndex) => (
        <MemoChar
          key={charIndex}
          char={char}
          userChar={userWord ? userWord[charIndex] : undefined}
        />
      ))}

      {/* user words length is bigger than the word length, show overflow letters */}
      {userWord && userWord.length > word.length && (
        <>
          {userWord
            .slice(word.length, word.length + 20)
            .split("")
            .map((char, overflowCharIndex) => (
              <Char
                char={char}
                className="text-red-800"
                userChar={"overflow-letter"}
                key={overflowCharIndex}
              />
            ))}
        </>
      )}
    </span>
  );
}
