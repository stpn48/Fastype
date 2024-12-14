"use client";

import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { useEffect, useRef } from "react";

export function Caret() {
  const caretRef = useRef<HTMLDivElement | null>(null);
  const { currWordIndex, currCharIndex } = useTypingFieldStore();

  useEffect(() => {
    const activeWord: HTMLSpanElement | null = document.querySelector(`.word-${currWordIndex}`);

    if (!activeWord || !caretRef.current) {
      return;
    }

    const wordChars: NodeListOf<HTMLSpanElement> = activeWord.querySelectorAll(".char");

    if (!wordChars.length) {
      return;
    }

    const currChar = wordChars[currCharIndex];

    if (!currChar) {
      const prevChar = wordChars[currCharIndex - 1];

      if (!prevChar) {
        return;
      }

      caretRef.current.style.left = `${prevChar.offsetLeft + prevChar.offsetWidth}px`;
      caretRef.current.style.top = `${prevChar.offsetTop}px`;

      return;
    }

    caretRef.current.style.left = `${currChar.offsetLeft}px`;
    caretRef.current.style.top = `${currChar.offsetTop}px`;
  }, [currCharIndex, currWordIndex]);

  return <div ref={caretRef} className="absolute h-[25px] w-[2px] bg-primary transition-all" />;
}
