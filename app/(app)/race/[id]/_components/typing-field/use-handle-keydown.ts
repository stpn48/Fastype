import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { useCallback, useEffect } from "react";

export function useHandleKeydown(text: string) {
  const {
    currWordIndex,
    setCurrWordIndex,
    currCharIndex,
    setCurrCharIndex,
    userWords,
    setUserWords,
    canType,
  } = useTypingFieldStore();

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
          const prevUserWord = userWords[currWordIndex - 1];

          if (prevUserWord !== prevRealWord) {
            setUserWords((prev) => prev.slice(0, -1));
            setCurrWordIndex((prev) => prev - 1);
            setCurrCharIndex(prevUserWord.length);
          }

          return;
        }

        return;
      }

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
    [currWordIndex, currCharIndex],
  );

  useEffect(() => {
    if (!canType) return;

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown, canType]);
}
