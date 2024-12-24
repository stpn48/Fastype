"use client";

import { useThemeColorsFor } from "@/hooks/useThemeColors";
import { cn } from "@/lib/utils";
import { Theme } from "@/types/types";
import { useTheme } from "next-themes";

type Props = {
  themeName: Theme;
};

export function ThemeButton({ themeName }: Props) {
  const { colors } = useThemeColorsFor(themeName);

  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(themeName)}
      className={cn(
        "flex w-full items-center justify-between rounded-lg p-2 hover:bg-secondary",
        theme === themeName && "bg-secondary/50",
      )}
    >
      <h2 className="capitalize">{themeName}</h2>

      <div
        className="flex items-center gap-1 rounded-full p-1"
        style={{ backgroundColor: `hsl(${colors.background})` }}
      >
        <div
          className={cn("size-4 rounded-full")}
          style={{ backgroundColor: `hsl(${colors.foreground})` }}
        />
        <div
          className={cn("size-4 rounded-full")}
          style={{ backgroundColor: `hsl(${colors.primary})` }}
        />
        <div
          className={cn("size-4 rounded-full")}
          style={{ backgroundColor: `hsl(${colors.secondary})` }}
        />
      </div>
    </button>
  );
}
