"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Palette } from "lucide-react";

export function ChangeThemeButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <button className="group">
            <Palette className="size-5 text-muted-foreground group-hover:text-foreground" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Change Theme</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
