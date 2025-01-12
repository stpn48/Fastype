"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { SettingsForm } from "./settings-form";

type Props = {
  isPracticeMode: boolean;
};

export function SettingsPopover({ isPracticeMode }: Props) {
  const { setCanType } = useTypingFieldStore();

  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    if (popoverOpen) {
      setCanType(false);
    } else {
      if (isPracticeMode) {
        setCanType(true);
      }
    }
  }, [popoverOpen]);

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger>
        <Settings className="size-3 cursor-pointer text-foreground opacity-100" />
      </PopoverTrigger>
      <PopoverContent>
        <SettingsForm />
      </PopoverContent>
    </Popover>
  );
}
