import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { useCallback, useEffect } from "react";

export function useHandleKeydown(text: string, canTypeLock?: boolean) {
  const {
    currWordIndex,
    setCurrWordIndex,
    currCharIndex,
    setCurrCharIndex,
    userWords,
    setUserWords,
    canType,
    hasMistake,
  } = useTypingFieldStore();

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      // letter
      if (e.key.length === 1 && e.code !== "Space") {
        setUserWords((prev) => {
          const newUserWords = [...prev];
          newUserWords[currWordIndex] += e.key;
          return newUserWords;
        });

        setCurrCharIndex((prev) => prev + 1);
        return;
      }

      // backspace
      if (e.key === "Backspace") {
        if (e.altKey) {
          setUserWords((prev) => {
            const newUserWords = [...prev];
            newUserWords[currWordIndex] = "";
            return newUserWords;
          });

          setCurrCharIndex(0);
          return;
        }

        if (currCharIndex > 0) {
          setUserWords((prev) => {
            const newUserWords = [...prev];
            newUserWords[currWordIndex] = newUserWords[currWordIndex].slice(0, -1);
            return newUserWords;
          });

          setCurrCharIndex((prev) => prev - 1);
          return;
        }

        if (currCharIndex === 0 && currWordIndex > 0 && hasMistake) {
          const prevUserWord = userWords[currWordIndex - 1];

          setUserWords((prev) => prev.slice(0, -1));
          setCurrWordIndex((prev) => prev - 1);
          setCurrCharIndex(prevUserWord.length);

          return;
        }

        return;
      }

      // space
      if (e.code === "Space") {
        e.preventDefault();
        const realWord = text.split(" ")[currWordIndex];
        if (currCharIndex >= realWord.length) {
          setUserWords((prev) => [...prev, ""]);
          setCurrWordIndex((prev) => prev + 1);
          setCurrCharIndex(0);
        }
      }
    },
    [currWordIndex, currCharIndex, hasMistake, text, userWords],
  );

  useEffect(() => {
    if (!canType && !canTypeLock) return;

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown, canType]);
}
