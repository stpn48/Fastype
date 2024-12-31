"use client";

import { useToolbar } from "../hooks/useToolbar";
import { ToolbarButton } from "./toolbar-button";

export function ModeOptions() {
  const { currMode, updateCurrMode } = useToolbar();

  return (
    <section className="flex gap-2">
      <ToolbarButton
        isActive={currMode === "random-words"}
        onClick={() => updateCurrMode("random-words")}
      >
        random
      </ToolbarButton>

      <ToolbarButton isActive={currMode === "quote"} onClick={() => updateCurrMode("quote")}>
        quote
      </ToolbarButton>

      <ToolbarButton isActive={currMode === "text"} onClick={() => updateCurrMode("text")}>
        text
      </ToolbarButton>
    </section>
  );
}
