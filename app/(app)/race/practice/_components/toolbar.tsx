"use client";

import { getRandomText } from "@/app/actions/get-random-text";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { parseAsTypingFieldMode } from "@/lib/nuqs/parsers";
import { AtSign, Hash } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useEffect } from "react";
import { toast } from "sonner";
import { TextLengthOptions } from "./text-length-options";
import { ToolbarButton } from "./toolbar-button";

export function Toolbar() {
  const [currMode, setCurrMode] = useQueryState(
    "currMode",
    parseAsTypingFieldMode.withDefault("normal-text"),
  );
  const [includePunctuation, setIncludePunctuation] = useQueryState("punctuation", parseAsBoolean);
  const [includeNumbers, setIncludeNumbers] = useQueryState("numbers", parseAsBoolean);

  const { setText, resetTypingFieldStore, setCanType } = useTypingFieldStore();

  useEffect(() => {
    if (!currMode) return;

    resetTypingFieldStore();
    setCanType(true);

    const generateNewText = async () => {
      const newText = await getRandomText(currMode);

      if (!newText) {
        toast.error("Failed to generate text");
        return;
      }

      setText(newText);
    };

    generateNewText();
  }, [currMode]);

  return (
    <div className="flex w-fit gap-2 rounded-lg bg-foreground/10 p-4 text-xs">
      <section className="flex gap-2 border-r">
        <ToolbarButton
          isActive={includePunctuation || false}
          onClick={() => setIncludePunctuation((prev) => !prev)}
        >
          <AtSign className="size-3" />
          <span>punctuation</span>
        </ToolbarButton>

        <ToolbarButton
          isActive={includeNumbers || false}
          onClick={() => setIncludeNumbers((prev) => !prev)}
        >
          <Hash className="size-3" />
          <span>numbers</span>
        </ToolbarButton>
      </section>

      <div className="w-[2px] rounded-lg bg-foreground/20" />

      <section className="flex gap-2">
        <ToolbarButton
          isActive={currMode === "random-words"}
          onClick={() => setCurrMode("random-words")}
        >
          random
        </ToolbarButton>

        <ToolbarButton isActive={currMode === "quote"} onClick={() => setCurrMode("quote")}>
          quote
        </ToolbarButton>

        <ToolbarButton
          isActive={currMode === "normal-text"}
          onClick={() => setCurrMode("normal-text")}
        >
          text
        </ToolbarButton>
      </section>

      <TextLengthOptions currMode={currMode} />
    </div>
  );
}
