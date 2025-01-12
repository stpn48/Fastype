import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { theme } from "@prisma/client";
import { ChangeThemeButton } from "./change-theme-button";
import { ThemeButton } from "./theme-button";

const themes: theme[] = ["light", "dark", "blue", "rose"];

export function ChangeThemeDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <ChangeThemeButton />
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle>Choose Theme</DialogTitle>
        </DialogHeader>
        <div className="flex h-[400px] flex-col gap-4 overflow-y-auto">
          {themes.map((theme) => (
            <ThemeButton themeName={theme} key={theme} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
