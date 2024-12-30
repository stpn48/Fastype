"use client";

import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { useEffect } from "react";
import { useBroadcastUserProgress } from "./use-broadcast-user-progress";

export function useHandleUserProgress(text: string, userId?: string, raceId?: string) {
  const { userWords, setHasMistake, setUserProgress } = useTypingFieldStore();

  // when race has id, it means it's not practice race, broadcast user progress to other users in the race
  if (raceId && userId) {
    useBroadcastUserProgress(userId, raceId);
  }

  // update user progress
  useEffect(() => {
    const textWithoutSpaces = text.replace(/\s+/g, "");

    // don't update progress if user has mistake
    if (userWords.join("") !== textWithoutSpaces.slice(0, userWords.join("").length)) {
      setHasMistake(true);
      return;
    }

    setHasMistake(false);

    const totalChars = textWithoutSpaces.length;
    const userChars = userWords.join("").length;
    const userProgress = (userChars / totalChars) * 100;

    setUserProgress(userProgress);
  }, [userWords, text]);
}
