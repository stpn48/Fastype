"use client";

import { parseAsRaceTextLength, parseAsTypingFieldMode } from "@/lib/nuqs/parsers";
import { TypingFieldMode } from "@/types/types";
import { race_text_length } from "@prisma/client";
import { parseAsBoolean, parseAsInteger, useQueryState } from "nuqs";
import { createContext, PropsWithChildren, useCallback, useContext, useMemo } from "react";

type ToolbarContextType = {
  currMode: TypingFieldMode;
  randomWordsCount: number;
  textLength: race_text_length;
  includeSymbols: boolean;
  includeNumbers: boolean;
  updateCurrMode: (newMode: TypingFieldMode) => void;
  updateRandomWordsCount: (newCount: number) => void;
  updateTextLength: (newLength: race_text_length) => void;
  updateIncludeSymbolstuation: (
    newIncludePunctuation: boolean | ((prev: boolean) => boolean),
  ) => void;
  updateIncludeNumbers: (newIncludeNumbers: boolean | ((prev: boolean) => boolean)) => void;
};

const ToolbarContext = createContext<ToolbarContextType | null>(null);

export function ToolbarProvider({ children }: PropsWithChildren) {
  const [currMode, setCurrMode] = useQueryState(
    "currMode",
    parseAsTypingFieldMode.withDefault("text"),
  );

  const [randomWordsCount, setRandomWordsCount] = useQueryState(
    "randomWordsCount",
    parseAsInteger.withDefault(50),
  );

  const [textLength, setTextLength] = useQueryState(
    "length",
    parseAsRaceTextLength.withDefault("medium"),
  );

  const [includeSymbols, setIncludeSymbols] = useQueryState(
    "symbols",
    parseAsBoolean.withDefault(false),
  );
  const [includeNumbers, setIncludeNumbers] = useQueryState(
    "numbers",
    parseAsBoolean.withDefault(false),
  );

  const updateCurrMode = useCallback(
    (newMode: TypingFieldMode) => {
      setCurrMode(newMode);
    },
    [setCurrMode],
  );

  const updateRandomWordsCount = useCallback(
    (newCount: number) => {
      setRandomWordsCount(newCount);
    },
    [setRandomWordsCount],
  );

  const updateTextLength = useCallback(
    (newLength: race_text_length) => {
      setTextLength(newLength);
    },
    [setTextLength],
  );

  const updateIncludeSymbolstuation = useCallback(
    (newIncludePunctuation: boolean | ((prev: boolean) => boolean)) => {
      setIncludeSymbols(newIncludePunctuation);
    },
    [setIncludeSymbols],
  );

  const updateIncludeNumbers = useCallback(
    (newIncludeNumbers: boolean | ((prev: boolean) => boolean)) => {
      setIncludeNumbers(newIncludeNumbers);
    },
    [setIncludeNumbers],
  );

  const value = useMemo(() => {
    return {
      currMode,
      randomWordsCount,
      textLength,
      includeSymbols,
      includeNumbers,
      updateCurrMode,

      updateRandomWordsCount,
      updateTextLength,
      updateIncludeSymbolstuation,
      updateIncludeNumbers,
    };
  }, [
    currMode,
    randomWordsCount,
    textLength,
    includeSymbols,
    includeNumbers,
    updateCurrMode,
    updateRandomWordsCount,
    updateTextLength,
    updateIncludeSymbolstuation,
    updateIncludeNumbers,
  ]);

  return <ToolbarContext.Provider value={value}>{children}</ToolbarContext.Provider>;
}

export function useToolbar() {
  const context = useContext(ToolbarContext);

  if (!context) {
    throw new Error("useToolbar must be used within a ToolbarProvider");
  }

  return context;
}
