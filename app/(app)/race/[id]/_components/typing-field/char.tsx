import { cn } from "@/lib/utils";

type Props = {
  char: string;
  userChar: string | undefined;
  isActive: boolean;
};

export function Char({ char, userChar, isActive }: Props) {
  return (
    <span
      className={cn(
        "",
        isActive && "active",
        userChar === "overflow-letter" && "text-red-800",
        userChar === char && "text-primary-foreground",
        userChar !== char && "text-red-600",
        userChar === undefined && "text-muted-foreground", // TODO: Adjust colors
      )}
    >
      {char}
    </span>
  );
}
