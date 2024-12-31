"use client";

import { getText } from "@/app/actions/get-random-text";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { useEffect } from "react";
import { toast } from "sonner";
import { TextLengthOptions } from "./text-length-options";
import { useToolbar } from "../hooks/useToolbar";
import { ModeOptions } from "./mode-options";
import { ToggleOptions } from "./toggle-options";
import { generate } from "random-words";

export function Toolbar() {
  const { setText, resetTypingFieldStore, setCanType, setIsLoading } = useTypingFieldStore();

  const { currMode, textLength, randomWordsCount } = useToolbar();

  useEffect(() => {
    if (!currMode) return;

    resetTypingFieldStore();
    setCanType(true);

    const generateNewText = async () => {
      setIsLoading(true);
      const { text, error } = await getText(currMode, textLength);
      setIsLoading(false);

      if (error) {
        toast.error(error);
        return;
      }

      if (!text) {
        toast.error("Failed to generate text");
        return;
      }

      setText(text);
    };

    if (currMode === "random-words") {
      const words = generate(randomWordsCount) as string[];

      setText(words.join(" "));
      return;
    }

    generateNewText();
  }, [currMode, textLength, resetTypingFieldStore, setCanType, setText, randomWordsCount]);

  return (
    <div className="flex w-fit gap-2 rounded-lg bg-foreground/10 p-4 text-xs">
      <ToggleOptions />

      <div className="w-[2px] rounded-lg bg-foreground/20" />

      <ModeOptions />

      <div className="w-[2px] rounded-lg bg-foreground/20" />

      <TextLengthOptions />
    </div>
  );
}
