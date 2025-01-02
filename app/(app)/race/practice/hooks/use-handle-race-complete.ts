import { handleRaceFinish } from "@/app/actions/handle-race-finish";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { useEffect, useState } from "react";

export function useHandleRaceComplete() {
  const [raceCompleted, setRaceCompleted] = useState(false);

  const { userProgress, userWpm } = useTypingFieldStore();

  useEffect(() => {
    if (userProgress === 100) {
      const handleRaceFinishAsync = async () => {
        await handleRaceFinish(userWpm);
      };

      setRaceCompleted(true);
      handleRaceFinishAsync();
    }
  }, [userProgress]);

  return { raceCompleted, setRaceCompleted };
}
