"use client";

import { disconnectUserFromRace } from "@/app/actions/disconnect-user-from-race";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

type Props = {
  userId: string;
  raceId: string;
};

export function DisconnectUserHandler({ userId, raceId }: Props) {
  const mounted = useRef(false);

  const router = useRouter();

  const { resetTypingFieldStore } = useTypingFieldStore();

  const dcUser = useCallback(async () => {
    await disconnectUserFromRace(userId, raceId);
    resetTypingFieldStore();
  }, [userId, raceId, resetTypingFieldStore]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      router.prefetch("/home");
      dcUser();
      router.push("/home");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [dcUser, router]);

  useEffect(() => {
    setTimeout(() => {
      mounted.current = true;
    }, 100);
  }, []);

  useEffect(() => {
    return () => {
      if (mounted.current) {
        dcUser();
      }
    };
  }, [dcUser]);

  return null;
}
