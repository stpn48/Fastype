import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChangeThemeButton } from "./change-theme-button";
import { ThemeButton } from "./theme-button";

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
          <ThemeButton themeName="dark" />
          <ThemeButton themeName="light" />
          <ThemeButton themeName="dark-forest" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
