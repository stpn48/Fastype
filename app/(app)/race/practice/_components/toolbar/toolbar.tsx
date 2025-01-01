"use client";

import { TextLengthOptions } from "./text-length-options";
import { ModeOptions } from "./mode-options";
import { ToggleOptions } from "./toggle-options";
import { useToolbar } from "@/app/(app)/race/practice/hooks/use-toolbar";
import { useHandleText } from "../../hooks/use-handle-text";

export function Toolbar() {
  const { currMode } = useToolbar();

  useHandleText();

  return (
    <div className="flex w-fit gap-2 rounded-lg bg-foreground/10 px-6 py-[14px] text-xs shadow-lg">
      {currMode === "random-words" && (
        <>
          <ToggleOptions />
          <div className="w-[2px] rounded-lg bg-foreground/20" />
        </>
      )}

      <ModeOptions />

      <div className="w-[2px] rounded-lg bg-foreground/20" />

      <TextLengthOptions />
    </div>
  );
}
