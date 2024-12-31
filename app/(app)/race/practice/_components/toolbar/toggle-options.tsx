"use client";

import { AtSign, Hash } from "lucide-react";
import { useToolbar } from "@/app/(app)/race/practice/hooks/use-toolbar";
import { ToolbarButton } from "./toolbar-button";

export function ToggleOptions() {
  const { includeSymbols, includeNumbers, updateIncludeSymbolstuation, updateIncludeNumbers } =
    useToolbar();

  return (
    <section className="flex gap-2">
      <ToolbarButton
        isActive={includeSymbols || false}
        onClick={() => updateIncludeSymbolstuation((prev) => !prev)}
      >
        <AtSign className="size-3" />
        <span>punctuation</span>
      </ToolbarButton>

      <ToolbarButton
        isActive={includeNumbers || false}
        onClick={() => updateIncludeNumbers((prev) => !prev)}
      >
        <Hash className="size-3" />
        <span>numbers</span>
      </ToolbarButton>
    </section>
  );
}
