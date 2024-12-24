"use client";

import { useRaceStore } from "@/hooks/zustand/use-race-store";
import { useEffect, useState } from "react";

export function useUserPlace(raceProgress: number) {
  const [userPlace, setUserPlace] = useState<number | null>(null);

  const { currPlace, setCurrPlace } = useRaceStore();

  useEffect(() => {
    if (raceProgress === 100) {
      setUserPlace(currPlace);
      setCurrPlace((prev) => prev + 1);
    }
  }, [raceProgress]);

  return { userPlace };
}
