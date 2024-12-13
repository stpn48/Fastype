"use client";

import { disconnectUserFromRace } from "@/app/actions/disconnect-user-from-race";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  userId: string;
  raceId: string;
};

export function RaceDisconnectHandler({ userId, raceId }: Props) {
  const { resetTypingFieldStore } = useTypingFieldStore();
  const router = useRouter();

  useEffect(() => {
    const cleanup = () => {
      disconnectUserFromRace(userId, raceId)
        .then(() => resetTypingFieldStore())
        .catch((err) => console.error("Error during disconnect:", err));
    };

    return () => {
      cleanup();
      router.push("/home");
    };
  }, [userId, raceId, resetTypingFieldStore]);

  return null;
}
