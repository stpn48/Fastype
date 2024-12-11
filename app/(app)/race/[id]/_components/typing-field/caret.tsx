"use client";

import { useEffect, useRef } from "react";

type Props = {
  currWordIndex: number;
  currCharIndex: number;
};

export function Caret({ currCharIndex, currWordIndex }: Props) {
  const caretRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currChar: HTMLSpanElement | null = document.querySelector(".active");

    if (!currChar) {
      return;
    }

    if (!caretRef.current) {
      throw new Error("caretRef not found");
    }

    caretRef.current.style.left = `${currChar.offsetLeft}px`;
    caretRef.current.style.top = `${currChar.offsetTop}px`;
  }, [currCharIndex, currWordIndex]);

  return <div ref={caretRef} className="absolute h-[25px] w-[2px] bg-primary transition-all" />;
}
