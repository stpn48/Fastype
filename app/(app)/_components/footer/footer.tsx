import { ChangeThemeButton } from "./change-theme-button";

export default function Footer() {
  return (
    <div className="flex h-[111px] items-center justify-between border-t border-border bg-background p-4 px-10">
      <section className="flex items-center gap-4">
        <p className="cursor-pointer text-muted-foreground hover:text-foreground">
          Terms of Service
        </p>
        <p className="cursor-pointer text-muted-foreground hover:text-foreground">Privacy Policy</p>
        <p className="cursor-pointer text-muted-foreground hover:text-foreground">Contact</p>
        <p className="cursor-pointer text-muted-foreground hover:text-foreground">Contribute</p>
      </section>
      <section>
        <ChangeThemeButton />
      </section>
    </div>
  );
}
