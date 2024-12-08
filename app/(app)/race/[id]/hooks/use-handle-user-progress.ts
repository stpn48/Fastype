import { updateUserProgress } from "@/app/actions/update-user-progress";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { useEffect, useRef } from "react";

export function useHandleUserProgress(text: string) {
  const { userWords } = useTypingFieldStore();

  // Ref to store the latest progress
  const progressBuffer = useRef<number | null>(null);

  // Ref to track the interval
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const sendBatchedUpdate = async () => {
    if (progressBuffer.current !== null) {
      const { error } = await updateUserProgress(progressBuffer.current);

      if (error) {
        console.error("Error updating user progress:", error);
      } else {
        console.log("User progress updated (batched):", progressBuffer.current);
      }

      // Clear the buffer after sending
      progressBuffer.current = null;
    }
  };

  useEffect(() => {
    const totalChars = text.length;
    const userChars = userWords.join("").length;
    const userProgress = (userChars / totalChars) * 100;

    // Store the latest progress in the buffer
    progressBuffer.current = userProgress;
  }, [userWords, text]);

  useEffect(() => {
    // Set up a fixed interval to send updates every 1s
    intervalRef.current = setInterval(() => {
      sendBatchedUpdate();
    }, 1000);

    // Cleanup the interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return null;
}
