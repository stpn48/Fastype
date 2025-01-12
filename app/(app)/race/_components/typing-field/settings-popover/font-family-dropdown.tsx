"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { font_family } from "@prisma/client";

const fontFamilies: font_family[] = ["geist_mono"];

export function FontFamilyDropdown() {
  const { fontFamily, setFontFamily } = useTypingFieldStore();

  return (
    <Select
      onValueChange={(value) => {
        setFontFamily(value as font_family);
      }}
      defaultValue={fontFamily!}
      name="font-family"
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Font Family" />
      </SelectTrigger>
      <SelectContent>
        {fontFamilies.map((fontFamily) => (
          <SelectItem key={fontFamily} value={fontFamily}>
            {fontFamily}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
