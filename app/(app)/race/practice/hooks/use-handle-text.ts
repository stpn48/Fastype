"use client";

import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { useCallback, useEffect } from "react";
import { generateNewText as generateNewTextAction } from "../utils/generate-new-text";
import { generateRandomWords } from "../utils/generate-random-words";
import { useToolbar } from "./use-toolbar";

const MAXIMUM_RANDOM_WORDS_COUNT = 10000;

export function useHandleText(raceCompleted: boolean) {
  const { setText, resetTypingFieldStore, setIsLoading, setCanType } = useTypingFieldStore();
  const { currMode, textLength, randomWordsCount, includeNumbers, includeSymbols } = useToolbar();

  const generateNewText = useCallback(async () => {
    if (currMode === "random-words") {
      let wordCount = randomWordsCount;

      if (wordCount > MAXIMUM_RANDOM_WORDS_COUNT) {
        wordCount = MAXIMUM_RANDOM_WORDS_COUNT;
      }

      const randomWords = generateRandomWords(wordCount, includeNumbers, includeSymbols);
      setText(randomWords);
      return;
    }

    const text = await generateNewTextAction(currMode, textLength, setIsLoading);

    if (!text) return;

    setText(text);
  }, [currMode, textLength, randomWordsCount, includeNumbers, includeSymbols]);

  useEffect(() => {
    if (raceCompleted) return;

    resetTypingFieldStore();
    setCanType(true);

    generateNewText();
  }, [raceCompleted, generateNewText]);

  return { generateNewText };
}
