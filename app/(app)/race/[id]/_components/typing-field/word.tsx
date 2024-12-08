import { Char } from "./char";

type Props = {
  word: string;
  userWord: string | null;
};

export function Word({ word, userWord }: Props) {
  return (
    <span>
      {word.split("").map((char, charIndex) => (
        <Char char={char} userChar={userWord ? userWord[charIndex] : null} key={charIndex} />
      ))}
      <span> </span>
    </span>
  );
}
