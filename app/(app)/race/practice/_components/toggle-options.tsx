"use client";

import { AtSign, Hash } from "lucide-react";
import { useToolbar } from "../hooks/useToolbar";
import { ToolbarButton } from "./toolbar-button";

export function ToggleOptions() {
  const { includePunctuation, includeNumbers, updateIncludePunctuation, updateIncludeNumbers } =
    useToolbar();

  return (
    <section className="flex gap-2">
      <ToolbarButton
        isActive={includePunctuation || false}
        onClick={() => updateIncludePunctuation((prev) => !prev)}
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
