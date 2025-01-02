"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { useEffect, useState } from "react";
import { useToolbar } from "../../hooks/use-toolbar";
import { ToolbarButton } from "./toolbar-button";

type Props = {};

export function ChooseCustomWordCountDialog({}: Props) {
  const { setCanType } = useTypingFieldStore();
  const { updateRandomWordsCount } = useToolbar();
  const [isOpen, setIsOpen] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCanType(false);
    } else {
      setCanType(true);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <ToolbarButton onClick={() => setIsOpen(true)}>custom</ToolbarButton>
      </DialogTrigger>
      <DialogContent className="w-[350px]">
        <DialogHeader>
          <DialogTitle>Choose a custom word count</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Enter your Custom word count"
          onChange={(e) => setWordCount(parseInt(e.target.value))}
          className=""
          type="number"
          max={1000}
        />
        <Button
          onClick={() => {
            updateRandomWordsCount(wordCount);
            setIsOpen(false);
          }}
        >
          Done
        </Button>
      </DialogContent>
    </Dialog>
  );
}
