import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { useEffect, useState } from "react";

export function useHandleRaceComplete() {
  const [raceCompleted, setRaceCompleted] = useState(false);

  const { userProgress, setCanType, resetTypingFieldStore } = useTypingFieldStore();

  useEffect(() => {
    if (userProgress === 100) {
      setRaceCompleted(true);
    }
  }, [userProgress]);

  useEffect(() => {
    if (!raceCompleted) {
      resetTypingFieldStore();
      setCanType(true);
    }
  }, [raceCompleted]);

  return { raceCompleted, setRaceCompleted };
}
