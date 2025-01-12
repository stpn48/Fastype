"use client";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { useCallback } from "react";
import { FontFamilySelect } from "./font-family-select";
import { PopoverItem } from "./popover-item";

const FONT_SIZE_CAP = 54;

export function SettingsForm() {
  const { fontSize, setFontSize, smoothCaret, setSmoothCaret, fontFamily, setFontFamily } =
    useTypingFieldStore();

  if (fontSize === null || smoothCaret === null || !fontFamily) {
    return;
  }

  const fontSizeInputOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof e.target.value !== "string") {
      return;
    }

    if (e.target.value === "") {
      setFontSize(0);
      return;
    }

    if (parseInt(e.target.value) > FONT_SIZE_CAP) {
      setFontSize(FONT_SIZE_CAP);
      return;
    }

    setFontSize(parseInt(e.target.value));
  }, []);

  return (
    <form className="flex flex-col gap-4">
      <PopoverItem label="Font Size" resetButton resetFn={() => setFontSize(20)}>
        <Input
          value={fontSize}
          onChange={fontSizeInputOnChange}
          placeholder="Font Size"
          type="number"
          className="w-full"
        />
      </PopoverItem>
      <PopoverItem label="Font Family" resetButton resetFn={() => setFontFamily("geist_mono")}>
        <FontFamilySelect />
      </PopoverItem>

      <PopoverItem label="Smooth Caret" resetButton resetFn={() => setSmoothCaret(true)}>
        <Switch name="smooth-caret" checked={smoothCaret} onCheckedChange={setSmoothCaret} />
      </PopoverItem>
    </form>
  );
}
