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
        console.log("key is valid adding it to curr user word", e.key);
        setUserWords((prev) => {
          const newUserWords = [...prev];
          newUserWords[currWordIndex] += e.key;
          return newUserWords;
        });

        console.log("increasing curr char index by 1");
        setCurrCharIndex((prev) => prev + 1);
        return;
      }

      if (e.key === "Backspace") {
        if (currCharIndex > 0) {
          console.log("removing curr char from curr user word");

          setUserWords((prev) => {
            const newUserWords = [...prev];
            newUserWords[currWordIndex] = newUserWords[currWordIndex].slice(0, -1);
            return newUserWords;
          });

          console.log("decreasing curr char index by 1");
          setCurrCharIndex((prev) => prev - 1);
          return;
        }

        if (currCharIndex === 0 && currWordIndex > 0) {
          console.log("checking if prev word has mistake");
          const prevRealWord = text.split(" ")[currWordIndex - 1];

          if (userWords[currWordIndex - 1] !== prevRealWord) {
            console.log("prev word has mistake, moving to it");
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
          console.log("user is at the end or beyond the word, increasing curr word index by 1");
          setUserWords((prev) => [...prev, ""]);
          setCurrWordIndex((prev) => prev + 1);
          console.log("setting curr char index to 0");
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
