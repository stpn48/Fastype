"use client";

import { memo, useCallback, useEffect, useState } from "react";

import { Word } from "./word";

type Props = {
  text: string;
};

const MemoWord = memo(Word);

export function TypingField({ text }: Props) {
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(0);
  const [userWords, setUserWords] = useState<string[]>([""]);

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
    console.log(userWords);
    console.log("curr user word", userWords[currWordIndex]);
    console.log("curr char index", currCharIndex);
    const realWord = text.split(" ")[currWordIndex];
    console.log("real word", realWord);
  }, [userWords, currWordIndex, currCharIndex, text]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);

  return (
    <div className="font-geist-mono h-[300px] w-full rounded-lg border border-border p-4 text-xl text-muted-foreground">
      {text.split(" ").map((word, wordIndex) => (
        <MemoWord
          word={word}
          userWord={wordIndex <= currWordIndex ? userWords[wordIndex] : null}
          key={wordIndex}
        />
      ))}
    </div>
  );
}
