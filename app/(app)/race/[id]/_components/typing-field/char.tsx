import { cn } from "@/lib/utils";

type Props = {
  char: string;
  userChar: string | null;
};

export function Char({ char, userChar }: Props) {
  return (
    <span
      className={cn(
        "",
        userChar === null && "text-muted-foreground",
        userChar === char && "text-primary-foreground",
        userChar && userChar !== char && "text-red-600",
      )}
    >
      {char}
    </span>
  );
}
