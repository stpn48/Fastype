import { cn } from "@/lib/utils";

type Props = {
  char: string;
  userChar: string | undefined;
};

export function Char({ char, userChar }: Props) {
  return (
    <span
      className={cn(
        "char",
        userChar === "overflow-letter" && "text-red-800",
        userChar === char && "text-primary-foreground",
        userChar !== char && "text-red-600",
        userChar === undefined && "text-muted-foreground/40", // TODO: Adjust colors
      )}
    >
      {char}
    </span>
  );
}
