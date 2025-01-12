"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { Repeat } from "lucide-react";
import { useCallback } from "react";

type Props = {
  generateText: () => void;
};

export function RegenerateTextButton({ generateText }: Props) {
  const { resetTypingFieldStore, setCanType } = useTypingFieldStore();

  const handleClick = useCallback(() => {
    resetTypingFieldStore();
    setCanType(true);
    generateText();
  }, [generateText]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger onClick={handleClick}>
          <Repeat className="size-3 transition-all hover:scale-110" />
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={10}>
          <p>Regenerate</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
