"use client";

import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { Char } from "./char";

type Props = {
  word: string;
  userWord: string | null;
  wordIndex: number;
  isActive: boolean;
};

const MemoChar = memo(Char);

export function Word({ word, userWord, wordIndex, isActive }: Props) {
  const { currCharIndex } = useTypingFieldStore();

  return (
    <span className="h-fit">
      {word.split("").map((char, charIndex) => (
        <MemoChar
          key={charIndex}
          char={char}
          userChar={userWord ? userWord[charIndex] : undefined}
          isActive={isActive && charIndex === currCharIndex}
        />
      ))}

      {/* user words length is bigger than the word length, show overflow letters */}
      {userWord && userWord.length > word.length && (
        <>
          {userWord!
            .slice(word.length)
            .split("")
            .map((char, overflowCharIndex) => (
              <Char
                char={char}
                userChar={"overflow-letter"}
                key={overflowCharIndex}
                isActive={isActive && overflowCharIndex === currCharIndex}
              />
            ))}
        </>
      )}

      <span className={cn("", isActive && currCharIndex >= word.length && "active")}>&nbsp;</span>
    </span>
  );
}
