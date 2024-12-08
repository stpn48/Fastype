import { cn } from "@/lib/utils";

type Props = {
  userWord: string | null;
  word: string;
  wordIndex: number;
};

export function OverflowLetters({ word, userWord, wordIndex }: Props) {
  return (
    <span>
      {userWord!
        .slice(word.length)
        .split("")
        .map((char, overflowCharIndex) => (
          <span
            key={overflowCharIndex}
            id={`word-${wordIndex}-char-${overflowCharIndex + word.length}`}
            className={cn("text-red-700")}
          >
            {char}
          </span>
        ))}
    </span>
  );
}
