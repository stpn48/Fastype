"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Repeat } from "lucide-react";

type Props = {
  generateNewText: () => void;
};

export function RegenerateTextButton({ generateNewText }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger onClick={generateNewText}>
          <Repeat className="size-3 transition-all hover:scale-110" />
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={10}>
          <p>Regenerate</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
