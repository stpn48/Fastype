import { handleRaceFinish } from "@/app/actions/handle-race-finish";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function useHandleRaceComplete() {
  const { userProgress, userWpm } = useTypingFieldStore();

  const router = useRouter();

  useEffect(() => {
    if (userProgress === 100) {
      const asyncHandleRaceComplete = async () => {
        const { error } = await handleRaceFinish(userWpm);

        if (error) {
          toast.error(error);
        }
      };

      router.prefetch("/race/practice/results");
      asyncHandleRaceComplete();
      router.push("/race/practice/results");
    }
  }, [userProgress, router, userWpm]);
}
