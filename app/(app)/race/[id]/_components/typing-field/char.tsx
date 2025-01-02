import { cn } from "@/lib/utils";

type Props = {
  char: string;
  userChar: string | undefined;
  className?: string;
};

export function Char({ char, userChar, className }: Props) {
  return (
    <span
      className={cn(
        "char",
        userChar === char && "text-primary-foreground",
        userChar !== char && "text-red-600",
        userChar === undefined && "text-muted-foreground/40", // TODO: Adjust colors
        className,
      )}
    >
      {char}
    </span>
  );
}
