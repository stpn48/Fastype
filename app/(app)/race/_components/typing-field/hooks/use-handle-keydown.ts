import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { useCallback, useEffect, useRef } from "react";

const INACTIVITY_TIMEOUT = 750;

export function useHandleKeydown(text: string) {
  const {
    currWordIndex,
    setCurrWordIndex,
    currCharIndex,
    setCurrCharIndex,
    userWords,
    setUserWords,
    canType,
    hasMistake,
    setIsTyping,
  } = useTypingFieldStore();

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      // logic to handle isTyping
      if (e.key.length === 1 || e.key === "Backspace" || e.code === "Space") {
        setIsTyping(true);

        // Clear any existing timeout when a key is pressed
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, INACTIVITY_TIMEOUT);
      }

      // Handle key logic (letters, backspace, space)
      if (e.key.length === 1 && e.code !== "Space") {
        setUserWords((prev) => {
          const newUserWords = [...prev];
          if (!newUserWords[currWordIndex]) newUserWords[currWordIndex] = "";
          newUserWords[currWordIndex] += e.key;
          return newUserWords;
        });

        setCurrCharIndex((prev) => prev + 1);
        return;
      }

      if (e.key === "Backspace") {
        if (currCharIndex > 0) {
          if (e.altKey) {
            setUserWords((prev) => {
              const newUserWords = [...prev];
              return newUserWords.slice(0, -1);
            });
            setCurrCharIndex(0);
            return;
          }

          setUserWords((prev) => {
            const newUserWords = [...prev];
            newUserWords[currWordIndex] = newUserWords[currWordIndex].slice(0, -1);
            return newUserWords;
          });

          setCurrCharIndex((prev) => prev - 1);
        }

        if (currCharIndex === 0 && currWordIndex > 0 && hasMistake) {
          if (e.altKey) {
            setUserWords((prev) => prev.slice(0, -1));
            setUserWords((prev) => {
              const updatedUserWords = [...prev];
              updatedUserWords[currWordIndex - 1] = "";
              return updatedUserWords;
            });
            setCurrWordIndex((prev) => Math.max(0, prev - 1)); // Ensure it doesn't go negative
            setCurrCharIndex(0); // Reset character index
            return;
          }

          const prevUserWord = userWords[currWordIndex - 1];
          setUserWords((prev) => prev.slice(0, -1));
          setCurrWordIndex((prev) => prev - 1);
          setCurrCharIndex(prevUserWord.length);
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
    [currWordIndex, currCharIndex, hasMistake, text, userWords],
  );

  useEffect(() => {
    if (!canType) return;

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown, canType]);

  // Clear timeout when the component unmounts
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);
}
