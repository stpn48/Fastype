import { updateUserProgress } from "@/app/actions/update-user-progress";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { debounce } from "lodash";
import { useCallback, useEffect } from "react";

export function useHandleUserProgress(text: string) {
  const { userWords } = useTypingFieldStore();

  // Wrap the updateProgress function with debounce
  const debouncedUpdateProgress = useCallback(
    debounce(async (userProgress: number) => {
      const { error } = await updateUserProgress(userProgress);

      if (error) {
        console.log("error updating user progress", error);
      }

      console.log("user progress updated", userProgress);
    }, 500), // Debounce with 500ms delay
    [],
  );

  useEffect(() => {
    const totalChars = text.length;

    const userChars = userWords.join("").length;

    const userProgress = (userChars / totalChars) * 100;

    debouncedUpdateProgress(userProgress);

    // Cleanup the debounced function on unmount
    return () => {
      debouncedUpdateProgress.cancel();
    };
  }, [userWords, text, debouncedUpdateProgress]);
}
