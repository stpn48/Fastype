"use client";

import { useToolbar } from "@/app/(app)/race/practice/hooks/use-toolbar";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import clsx from "clsx";
import { RegenerateTextButton } from "../regenerate-text-button";
import { ModeOptions } from "./mode-options";
import { TextLengthOptions } from "./text-length-options";
import { ToggleOptions } from "./toggle-options";

export function Toolbar({ generateNewText }: { generateNewText: () => void }) {
  const { currMode } = useToolbar();
  const { isTyping } = useTypingFieldStore();

  return (
    <div
      className={clsx(
        "duration-400 flex w-fit gap-6 rounded-lg bg-foreground/5 px-[24px] py-[12px] text-xs transition-all",
        isTyping && "scale-0 opacity-0",
      )}
    >
      {currMode === "random-words" && (
        <>
          <ToggleOptions />
          <div className="w-[4px] rounded-lg bg-foreground/10" />
        </>
      )}

      <ModeOptions />

      <div className="w-[4px] rounded-lg bg-foreground/10" />

      <TextLengthOptions />

      <div className="w-[4px] rounded-lg bg-foreground/10" />

      <RegenerateTextButton generateNewText={generateNewText} />
    </div>
  );
}
