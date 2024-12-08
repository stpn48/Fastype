import { Char } from "./char";
import { OverflowLetters } from "./overflow-letters";

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

      {/* user words length is bigger than the word length, show overflow letters */}
      {userWord && userWord.length > word.length && (
        <OverflowLetters word={word} userWord={userWord} wordIndex={wordIndex} />
      )}

      <span
        id={`word-${wordIndex}-char-${userWord && userWord?.length > word.length ? userWord.length : word.length}`}
      >
        {" "}
      </span>
    </>
  );
}
