"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SwatchBook } from "lucide-react";

export function ChangeThemeButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <SwatchBook className="size-4 text-muted-foreground group-hover:text-foreground" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Change Theme</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
