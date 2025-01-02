import { ChangeThemeDialog } from "./change-theme-dialog";

export default function Footer() {
  return (
    <div className="flex h-[75px] items-center justify-between border-t border-border bg-background p-4 px-6 text-xs">
      <section className="flex items-center gap-4">
        <p className="cursor-pointer text-muted-foreground hover:text-foreground">
          Terms of Service
        </p>
        <p className="cursor-pointer text-muted-foreground hover:text-foreground">Privacy Policy</p>
        <p className="cursor-pointer text-muted-foreground hover:text-foreground">Contact</p>
        <p className="cursor-pointer text-muted-foreground hover:text-foreground">Contribute</p>
      </section>

      <section>
        <ChangeThemeDialog />
      </section>
    </div>
  );
}
