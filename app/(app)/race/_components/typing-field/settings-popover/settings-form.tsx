"use client";

import { updateUserConfig } from "@/app/actions/update-user-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { font_family } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useActionState, useCallback } from "react";
import { FontFamilyDropdown } from "./font-family-dropdown";
import { SettingsFormSkeleton } from "./settings-form-skeleton";
import { useUserConfig } from "./use-user-config";

type Props = {
  closePopover: () => void;
};

export function SettingsForm({ closePopover }: Props) {
  const { userConfig } = useUserConfig();

  const handleSubmit = useCallback(
    async (_: unknown, formData: FormData) => {
      const fontSize = parseInt(formData.get("font-size") as string);
      const fontFamily = formData.get("font-family") as font_family;
      const smoothCaret = formData.get("smooth-caret") === "on";

      const { error } = await updateUserConfig({
        typing_field_font_size: fontSize,
        typing_field_font_family: fontFamily,
        typing_field_smooth_caret: smoothCaret,
      });

      if (error) {
        return { error };
      }

      closePopover();

      return { error: null };
    },
    [closePopover],
  );

  const [data, submitAction, isPending] = useActionState(handleSubmit, { error: null });

  // show skeleton while is loading
  if (!userConfig) {
    return <SettingsFormSkeleton />;
  }

  return (
    <form action={submitAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground" htmlFor="font-size-input">
          Font Size
        </label>
        <Input
          disabled={isPending}
          id="font-size-input"
          placeholder="Font Size"
          type="number"
          name="font-size"
          className="w-full"
          defaultValue={userConfig.typing_field_font_size}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Font Family</label>
        <FontFamilyDropdown
          defaultValue={userConfig.typing_field_font_family}
          disabled={isPending}
        />
      </div>

      <div className="w full mt-2 flex justify-between">
        <label className="text-sm text-foreground">Smooth Caret</label>
        <Switch
          disabled={isPending}
          name="smooth-caret"
          defaultChecked={userConfig.typing_field_smooth_caret || true}
        />
      </div>

      {data.error && <p className="text-red-500">{data.error}</p>}

      <Button disabled={isPending} className="mt-2">
        {isPending && <Loader2 className="size-3 animate-spin" />}
        Save
      </Button>
    </form>
  );
}
