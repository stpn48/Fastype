import { cn } from "@/lib/utils";
import { Char } from "./char";

type Props = {
  word: string;
  userWord: string | null;
  wordIndex: number;
};

export function Word({ word, userWord, wordIndex }: Props) {
  return (
    <>
      <span>
        {word.split("").map((char, charIndex) => (
          <Char
            key={charIndex}
            char={char}
            userChar={userWord ? userWord[charIndex] : null}
            wordIndex={wordIndex}
            charIndex={charIndex}
          />
        ))}
      </span>

      {userWord && userWord.length > word.length && (
        <span>
          {userWord
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
      )}

      <span
        id={`word-${wordIndex}-char-${userWord && userWord?.length > word.length ? userWord.length : word.length}`}
      >
        {" "}
      </span>
    </>
  );
}
