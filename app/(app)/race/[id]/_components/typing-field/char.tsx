import { cn } from "@/lib/utils";

type Props = {
  char: string;
  userChar: string | null;
  wordIndex: number;
  charIndex: number;
};

export function Char({ char, userChar, wordIndex, charIndex }: Props) {
  return (
    <span
      id={`word-${wordIndex}-char-${charIndex}`}
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
