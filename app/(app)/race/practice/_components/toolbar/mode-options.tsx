"use client";

import { Dices, Quote, TypeOutline } from "lucide-react";
import { ToolbarButton } from "./toolbar-button";
import { useToolbar } from "@/app/(app)/race/practice/hooks/use-toolbar";

export function ModeOptions() {
  const { currMode, updateCurrMode } = useToolbar();

  return (
    <section className="flex gap-2">
      <ToolbarButton
        isActive={currMode === "random-words"}
        onClick={() => updateCurrMode("random-words")}
      >
        <Dices className="size-3" />
        random
      </ToolbarButton>

      <ToolbarButton isActive={currMode === "quote"} onClick={() => updateCurrMode("quote")}>
        <Quote className="size-3" />
        quote
      </ToolbarButton>

      <ToolbarButton isActive={currMode === "text"} onClick={() => updateCurrMode("text")}>
        <TypeOutline className="size-3" />
        text
      </ToolbarButton>
    </section>
  );
}
