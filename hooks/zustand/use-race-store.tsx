import { RaceUser } from "@/types/types";
import { create } from "zustand";

type RaceStore = {
  currPlace: number;
  setCurrPlace: (place: number | ((prev: number) => number)) => void;

  countdown: number | null;
  setCountdown: (countdown: number | null | ((prev: number | null) => number | null)) => void;

  raceUsers: RaceUser[];
  setRaceUsers: (users: RaceUser[]) => void;

  raceStartedAt: Date | null;
  setRaceStartedAt: (startedAt: Date | null | ((prev: Date | null) => Date | null)) => void;

  resetRaceStore: () => void;
};

export const useRaceStore = create<RaceStore>((set) => ({
  currPlace: 1,
  setCurrPlace: (place) =>
    set((state) => ({ currPlace: typeof place === "function" ? place(state.currPlace) : place })),

  countdown: null,
  setCountdown: (countdown) =>
    set((state) => ({
      countdown: typeof countdown === "function" ? countdown(state.countdown) : countdown,
    })),

  raceUsers: [],
  setRaceUsers: (users) => set({ raceUsers: users }),

  raceStartedAt: null,
  setRaceStartedAt: (startedAt) =>
    set((state) => ({
      raceStartedAt: typeof startedAt === "function" ? startedAt(state.raceStartedAt) : startedAt,
    })),

  resetRaceStore: () => set({ currPlace: 1, countdown: null, raceUsers: [] }),
}));
