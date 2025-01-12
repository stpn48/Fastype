"use client";

import { RotateCcw } from "lucide-react";

type Props = {
  resetButton?: boolean;
  resetFn?: () => void;
  label: string;
  children: React.ReactNode;
};

export function PopoverItem({ resetButton, resetFn, label, children }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex w-full items-center justify-between">
        <label className="text-xs text-muted-foreground">{label}</label>
        {resetButton && (
          <RotateCcw onClick={resetFn} className="size-2 cursor-pointer text-muted-foreground" />
        )}
      </div>
      {children}
    </div>
  );
}
