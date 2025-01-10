"use client";

import { useToolbar } from "@/app/(app)/race/practice/hooks/use-toolbar";
import { Dices, Quote, Terminal, TypeOutline } from "lucide-react";
import { ToolbarButton } from "./toolbar-button";

export function ModeOptions() {
  const { currMode, updateCurrMode } = useToolbar();

  return (
    <section className="flex gap-6">
      <ToolbarButton
        className="flex gap-2"
        isActive={currMode === "random-words"}
        onClick={() => updateCurrMode("random-words")}
      >
        <Dices className="size-4" />
        random
      </ToolbarButton>

      <ToolbarButton
        className="flex gap-2"
        isActive={currMode === "quote"}
        onClick={() => updateCurrMode("quote")}
      >
        <Quote className="size-4" />
        quote
      </ToolbarButton>

      <ToolbarButton
        className="flex gap-2"
        isActive={currMode === "text"}
        onClick={() => updateCurrMode("text")}
      >
        <TypeOutline className="size-4" />
        text
      </ToolbarButton>

      <ToolbarButton
        className="flex gap-2"
        isActive={currMode === "javascript"}
        onClick={() => updateCurrMode("javascript")}
      >
        <Terminal className="size-4" />
        javascript
      </ToolbarButton>
    </section>
  );
}
