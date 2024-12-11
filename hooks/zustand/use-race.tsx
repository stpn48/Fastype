import { create } from "zustand";

type RaceStore = {
  canType: boolean;
  setCanType: (canType: boolean) => void;

  resetRaceStore: () => void;
};

export const useRace = create<RaceStore>((set) => ({
  canType: false,
  setCanType: (canType) => set({ canType }),

  resetRaceStore: () => set({ canType: false }),
}));
