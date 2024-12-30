"use client";

import { TypingFieldMode } from "@/types/types";
import { ToolbarButton } from "./toolbar-button";

type Props = {
  currMode: TypingFieldMode | null;
};

export function TextLengthOptions({ currMode }: Props) {
  if (currMode === "quote")
    return (
      <>
        <div className="w-[2px] rounded-lg bg-foreground/20" />

        <section className="flex gap-2 border-r">
          <ToolbarButton>Short</ToolbarButton>
          <ToolbarButton>Medium</ToolbarButton>
          <ToolbarButton>Long</ToolbarButton>
        </section>
      </>
    );

  if (currMode === "random-words")
    return (
      <>
        <div className="w-[2px] rounded-lg bg-foreground/20" />

        <section className="flex gap-2 border-r">
          <ToolbarButton>25</ToolbarButton>
          <ToolbarButton>50</ToolbarButton>
          <ToolbarButton>100</ToolbarButton>
          <ToolbarButton>150</ToolbarButton>
          <ToolbarButton>Custom</ToolbarButton>
        </section>
      </>
    );

  return null;
}
