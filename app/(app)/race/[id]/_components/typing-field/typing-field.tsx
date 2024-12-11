"use client";

import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { memo, useCallback, useEffect } from "react";
import { useHandleUserProgress } from "../../hooks/use-handle-user-progress";
import { Caret } from "./caret";
import { Word } from "./word";

type Props = {
  text: string;
};

const MemoWord = memo(Word);

export function TypingField({ text }: Props) {
  const {
    currWordIndex,
    setCurrWordIndex,
    currCharIndex,
    setCurrCharIndex,
    userWords,
    setUserWords,
  } = useTypingFieldStore();

  useHandleUserProgress(text);

  // TODO: move this into hook
  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key.length === 1 && e.code !== "Space") {
        setUserWords((prev) => {
          const newUserWords = [...prev];
          newUserWords[currWordIndex] += e.key;
          return newUserWords;
        });

        setCurrCharIndex((prev) => prev + 1);
        return;
      }

      if (e.key === "Backspace") {
        if (currCharIndex > 0) {
          setUserWords((prev) => {
            const newUserWords = [...prev];
            newUserWords[currWordIndex] = newUserWords[currWordIndex].slice(0, -1);
            return newUserWords;
          });

          setCurrCharIndex((prev) => prev - 1);
          return;
        }

        if (currCharIndex === 0 && currWordIndex > 0) {
          const prevRealWord = text.split(" ")[currWordIndex - 1];

          if (userWords[currWordIndex - 1] !== prevRealWord) {
            setUserWords((prev) => prev.slice(0, -1));
            setCurrWordIndex((prev) => prev - 1);
            setCurrCharIndex(prevRealWord.length);
          }

          return;
        }

        return;
      }

      if (e.code === "Space") {
        const realWord = text.split(" ")[currWordIndex];
        if (currCharIndex >= realWord.length) {
          setUserWords((prev) => [...prev, ""]);
          setCurrWordIndex((prev) => prev + 1);
          setCurrCharIndex(0);
        }
      }
    },
    [currWordIndex, currCharIndex],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);

  return (
    <div className="relative flex w-full flex-wrap rounded-lg border border-border p-6 font-geist-mono text-xl text-muted-foreground">
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
