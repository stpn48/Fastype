"use client";

import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { useEffect, useState } from "react";

export function useUserPlace(raceProgress: number) {
  const [userPlace, setUserPlace] = useState<number | null>(null);

  const { currPlace, setCurrPlace } = useTypingFieldStore();

  useEffect(() => {
    if (raceProgress === 100) {
      setUserPlace(currPlace);
      setCurrPlace((prev) => prev + 1);
    }
  }, [raceProgress]);

  return { userPlace };
}
