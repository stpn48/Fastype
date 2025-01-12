"use client";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { FontFamilyDropdown } from "./font-family-dropdown";
import { SettingsFormSkeleton } from "./settings-form-skeleton";

export function SettingsForm() {
  const { fontSize, setFontSize, smoothCaret, setSmoothCaret, fontFamily } = useTypingFieldStore();

  if (fontSize === null || smoothCaret === null || !fontFamily) {
    return <SettingsFormSkeleton />;
  }

  return (
    <form className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground" htmlFor="font-size-input">
          Font Size
        </label>
        <Input
          onChange={(e) => {
            if (e.target.value === "") {
              setFontSize(0);
              return;
            }

            setFontSize(parseInt(e.target.value));
          }}
          id="font-size-input"
          placeholder="Font Size"
          type="number"
          name="font-size"
          className="w-full"
          defaultValue={fontSize}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Font Family</label>
        <FontFamilyDropdown />
      </div>

      <div className="w full mt-2 flex justify-between">
        <label className="text-sm text-foreground">Smooth Caret</label>
        <Switch name="smooth-caret" defaultChecked={smoothCaret} onCheckedChange={setSmoothCaret} />
      </div>
    </form>
  );
}
