"use client";

import symbols from "@/public/symbols.json";
import { shuffleArray } from "@/lib/utils";
import { generate } from "random-words";

const NUMBER_RATIO = 4;
const SYMBOL_RATIO = 6;

export function generateRandomWords(
  randomWordsCount: number,
  includeNumbers: boolean,
  includeSymbols: boolean,
) {
  const words = generate(randomWordsCount) as string[];

  if (includeNumbers) {
    const numberCount = Math.floor(words.length / NUMBER_RATIO);
    Array.from({ length: numberCount }).forEach(() => {
      words.push(Math.floor(Math.random() * 1000).toString());
    });
  }

  if (includeSymbols) {
    const symbolCount = Math.floor(words.length / SYMBOL_RATIO);
    Array.from({ length: symbolCount }).forEach(() => {
      words.push(symbols[Math.floor(Math.random() * symbols.length)]);
    });
  }

  return shuffleArray(words).join(" ");
}
