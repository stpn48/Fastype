"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { font_family } from "@prisma/client";

type Props = {
  disabled?: boolean;
  defaultValue?: font_family;
};

const fontFamilies: font_family[] = ["geist_mono"];

export function FontFamilyDropdown({ disabled, defaultValue }: Props) {
  return (
    <Select defaultValue={defaultValue} name="font-family" disabled={disabled}>
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
