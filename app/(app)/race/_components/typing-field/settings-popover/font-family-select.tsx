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

const fontFamilies = ["Geist Mono", "Geist Sans"];

export function FontFamilySelect() {
  const { fontFamily, setFontFamily } = useTypingFieldStore();

  return (
    <Select
      onValueChange={(value) => {
        if (value === "Geist Mono") {
          setFontFamily("geist_mono");
        }

        if (value === "Geist Sans") {
          setFontFamily("geist_sans");
        }
      }}
      name="font-family"
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={getFontFamilyName(fontFamily!)} />
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

function getFontFamilyName(fontFamily: font_family) {
  switch (fontFamily) {
    case "geist_mono":
      return "Geist Mono";
    case "geist_sans":
      return "Geist Sans";
    default:
      return fontFamily;
  }
}
