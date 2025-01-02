"use client";

import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { useEffect } from "react";
import { generateNewText } from "../utils/generate-new-text";
import { generateRandomWords } from "../utils/generate-random-words";
import { useToolbar } from "./use-toolbar";

export function useHandleText(raceCompleted: boolean) {
  const { setText, resetTypingFieldStore, setIsLoading, setCanType } = useTypingFieldStore();
  const { currMode, textLength, randomWordsCount, includeNumbers, includeSymbols } = useToolbar();

  useEffect(() => {
    if (raceCompleted) return;

    resetTypingFieldStore();
    setCanType(true);

    if (currMode === "random-words") {
      const randomWords = generateRandomWords(randomWordsCount, includeNumbers, includeSymbols);
      setText(randomWords);
      return;
    }

    (async () => {
      const text = await generateNewText(currMode, textLength, setIsLoading);

      if (!text) return;

      setText(text);
    })();
  }, [raceCompleted, currMode, textLength, randomWordsCount, includeNumbers, includeSymbols]);
}
