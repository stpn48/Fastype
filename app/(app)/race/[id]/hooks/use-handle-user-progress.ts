import { updateUserProgress } from "@/app/actions/update-user-progress";
import { useCallback, useEffect } from "react";

export function useHandleUserProgress(userWords: string[], text: string) {
  const updateProgress = useCallback(async (userProgress: number) => {
    const { error } = await updateUserProgress(userProgress);

    // TODO: add toast with sonner
    if (error) {
      console.log("error updating user progress", error);
    }

    console.log("user progress updated", userProgress);
  }, []);

  useEffect(() => {
    const totalChars = text.length;

    const userChars = userWords.join("").length;

    const userProgress = (userChars / totalChars) * 100;

    updateProgress(userProgress);

    // calculate users progress in %
  }, [userWords, text]);
}
