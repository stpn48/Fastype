import { RaceUser } from "@/types/types";
import { create } from "zustand";

type RaceStore = {
  currPlace: number;
  setCurrPlace: (place: number | ((prev: number) => number)) => void;

  raceStartedAt: string | null;
  setRaceStartedAt: (startedAt: string | null) => void;

  countdown: number | null;
  setCountdown: (countdown: number | null | ((prev: number | null) => number | null)) => void;

  raceUsers: RaceUser[];
  setRaceUsers: (users: RaceUser[]) => void;

  resetRaceStore: () => void;
};

export const useRaceStore = create<RaceStore>((set) => ({
  currPlace: 1,
  setCurrPlace: (place) =>
    set((state) => ({ currPlace: typeof place === "function" ? place(state.currPlace) : place })),

  raceStartedAt: null,
  setRaceStartedAt: (startedAt) => set({ raceStartedAt: startedAt }),

  countdown: null,
  setCountdown: (countdown) =>
    set((state) => ({
      countdown: typeof countdown === "function" ? countdown(state.countdown) : countdown,
    })),

  raceUsers: [],
  setRaceUsers: (users) => set({ raceUsers: users }),

  resetRaceStore: () => set({ currPlace: 1, raceStartedAt: null, countdown: null, raceUsers: [] }),
}));
