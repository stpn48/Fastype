"use clients";

import { Switch } from "@/components/ui/switch";

export function SettingsFormSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground" htmlFor="font-size-input">
          Font Size
        </label>
        <div className="h-[36px] w-full animate-pulse rounded-lg bg-secondary" />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Font Family</label>
        <div className="h-[36px] w-full animate-pulse rounded-lg bg-secondary" />
      </div>

      <div className="w full mt-2 flex justify-between">
        <label className="text-sm text-foreground">Smooth Caret</label>
        <Switch disabled={true} />
      </div>
    </div>
  );
}
