import { create } from "zustand";

type TypingFieldStore = {
  currWordIndex: number;
  setCurrWordIndex: (index: number | ((prev: number) => number)) => void;

  currCharIndex: number;
  setCurrCharIndex: (index: number | ((prev: number) => number)) => void;

  userWords: string[];
  setUserWords: (words: string[] | ((prev: string[]) => string[])) => void;

  canType: boolean;
  setCanType: (canType: boolean) => void;

  hasMistake: boolean;
  setHasMistake: (hasMistake: boolean) => void;

  userWpm: number;
  setUserWpm: (wpm: number) => void;

  userProgress: number;
  setUserProgress: (progress: number | ((prev: number) => number)) => void;

  text: string;
  setText: (text: string) => void;

  resetTypingFieldStore: () => void;
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

  canType: false,
  setCanType: (canType) => set({ canType }),

  hasMistake: false,
  setHasMistake: (hasMistake) => set({ hasMistake }),

  userWpm: 0,
  setUserWpm: (wpm) => set({ userWpm: wpm }),

  userProgress: 0,
  setUserProgress: (progress) =>
    set((state) => ({
      userProgress: typeof progress === "function" ? progress(state.userProgress) : progress,
    })),

  text: "",
  setText: (text) => set({ text }),

  resetTypingFieldStore: () =>
    set({
      currWordIndex: 0,
      currCharIndex: 0,
      userWords: [""],
      canType: false,
      hasMistake: false,
      userWpm: 0,
      userProgress: 0,
    }),
}));
