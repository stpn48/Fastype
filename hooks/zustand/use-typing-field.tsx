import { create } from "zustand";

type TypingFieldStore = {
  currWordIndex: number;
  setCurrWordIndex: (index: number | ((prev: number) => number)) => void;
  currCharIndex: number;
  setCurrCharIndex: (index: number | ((prev: number) => number)) => void;
  userWords: string[];
  setUserWords: (words: string[] | ((prev: string[]) => string[])) => void;
};

export const useTypingFieldStore = create<TypingFieldStore>((set) => ({
  currWordIndex: 0,
  setCurrWordIndex: (index) =>
    set((state) => ({
      currWordIndex: typeof index === "function" ? index(state.currWordIndex) : index,
    })),

  currCharIndex: 0,
  setCurrCharIndex: (index) =>
    set((state) => ({
      currCharIndex: typeof index === "function" ? index(state.currCharIndex) : index,
    })),

  userWords: [""],
  setUserWords: (words) =>
    set((state) => ({ userWords: typeof words === "function" ? words(state.userWords) : words })),
}));
