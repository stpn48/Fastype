"use client";

import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { useEffect } from "react";
import { calculateUserWpm } from "../_components/race-track/hooks/use-race-progress";
import { useBroadcastUserProgress } from "./use-broadcast-user-progress";

export function useHandleUserProgress(text: string, userId?: string, raceId?: string) {
  const {
    userWords,
    setHasMistake,
    setUserProgress,
    currCharIndex,
    currWordIndex,
    setTotalMistakes,
    setStartedTypingAt,
    startedTypingAt,
    setUserWpm,
  } = useTypingFieldStore();

  useBroadcastUserProgress(userId, raceId);

  // update user progress
  useEffect(() => {
    const textArr = text.split(" ");
    const currWord = textArr[currWordIndex];
    const currUserWord = userWords[currWordIndex];

    const userWordsJoined = userWords.join("");
    const textArrJoined = textArr.join("");

    if (userWordsJoined.length === 1) {
      setStartedTypingAt((prev) => (prev ? prev : new Date().toISOString()));
    }

    // if curr letter is not matching with the actual letter increment total mistakes
    if (
      currWord &&
      currUserWord &&
      currWord[currCharIndex - 1] !== currUserWord[currCharIndex - 1]
    ) {
      setTotalMistakes((prev) => prev + 1);
    }

    if (textArrJoined.slice(0, userWordsJoined.length) !== userWords.join("")) {
      setHasMistake(true);
      return;
    } else {
      setHasMistake(false);
    }

    // calculate user progress
    const totalChars = textArrJoined.length;
    const userChars = userWordsJoined.length;
    const userProgress = (userChars / totalChars) * 100;
    setUserProgress(userProgress);

    // calculate user WPM
    if (startedTypingAt) {
      const wpm = calculateUserWpm(startedTypingAt, userProgress, textArr.length);
      setUserWpm(wpm);
    }
  }, [userWords, text, currCharIndex, currWordIndex, startedTypingAt]);
}
