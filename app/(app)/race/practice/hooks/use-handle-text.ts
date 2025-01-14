"use client";

import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { useCallback, useEffect, useState } from "react";
import { generateJSWords } from "../utils/generate-js-words";
import { generateNewText } from "../utils/generate-new-text";
import { generateRandomWords } from "../utils/generate-random-words";
import { useToolbar } from "./use-toolbar";

const MAXIMUM_RANDOM_WORDS_COUNT = 10000;

export function useHandleText(raceCompleted: boolean) {
  const { setText, resetTypingFieldStore, setIsLoading, setCanType } = useTypingFieldStore();
  const { currMode, textLength, randomWordsCount, includeNumbers, includeSymbols } = useToolbar();
  const [isMounted, setIsMounted] = useState(false);

  const generateText = useCallback(async () => {
    if (currMode === "random-words") {
      let wordCount = randomWordsCount;

      if (wordCount > MAXIMUM_RANDOM_WORDS_COUNT) {
        wordCount = MAXIMUM_RANDOM_WORDS_COUNT;
      }

      const randomWords = generateRandomWords(wordCount, includeNumbers, includeSymbols);
      setText(randomWords);
      return;
    }

    if (currMode === "javascript") {
      let wordCount = randomWordsCount;

      if (wordCount > MAXIMUM_RANDOM_WORDS_COUNT) {
        wordCount = MAXIMUM_RANDOM_WORDS_COUNT;
      }

      const jsWords = generateJSWords(wordCount);
      setText(jsWords);
      return;
    }

    setIsLoading(true);
    const text = await generateNewText(currMode, textLength);
    setIsLoading(false);

    if (!text) return;

    setText(text);
  }, [currMode, textLength, randomWordsCount, includeNumbers, includeSymbols]);

  // after closing the dialog, reset typing field store and generate new text
  useEffect(() => {
    setIsMounted(true);

    if (raceCompleted || !isMounted) return;

    resetTypingFieldStore();
    setCanType(true);

    generateText();
  }, [raceCompleted, generateText, isMounted]);

  return { generateText };
}
