"use client";

import { useToolbar } from "@/app/(app)/race/practice/hooks/use-toolbar";
import { AtSign, Hash } from "lucide-react";
import { ToolbarButton } from "./toolbar-button";

export function ToggleOptions() {
  const { includeSymbols, includeNumbers, updateIncludeSymbols, updateIncludeNumbers } =
    useToolbar();

  return (
    <section className="flex gap-4">
      <ToolbarButton
        isActive={includeSymbols || false}
        onClick={() => updateIncludeSymbols((prev) => !prev)}
      >
        <AtSign className="size-4" />
        <span>punctuation</span>
      </ToolbarButton>

      <ToolbarButton
        isActive={includeNumbers || false}
        onClick={() => updateIncludeNumbers((prev) => !prev)}
      >
        <Hash className="size-4" />
        <span>numbers</span>
      </ToolbarButton>
    </section>
  );
}
