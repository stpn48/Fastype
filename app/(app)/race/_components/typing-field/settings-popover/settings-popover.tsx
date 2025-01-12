"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { SettingsForm } from "./settings-form";

type Props = {};

export function SettingsPopover({}: Props) {
  const { setCanType } = useTypingFieldStore();

  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    if (popoverOpen) {
      setCanType(false);
    } else {
      setCanType(true);
    }
  }, [popoverOpen]);

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger className="absolute bottom-4 right-4">
        <Settings className="size-3 cursor-pointer text-muted-foreground opacity-100 hover:text-foreground" />
      </PopoverTrigger>
      <PopoverContent>
        <SettingsForm />
      </PopoverContent>
    </Popover>
  );
}
