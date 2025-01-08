"use client";

import { disconnectUserFromRace } from "@/app/actions/disconnect-user-from-race";
import { useRaceStore } from "@/hooks/zustand/use-race-store";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

type Props = {
  userId: string;
  raceId: string;
};

export function DisconnectUserHandler({ userId, raceId }: Props) {
  const mounted = useRef(false);

  const router = useRouter();

  const { resetTypingFieldStore } = useTypingFieldStore();
  const { resetRaceStore } = useRaceStore();

  const dcUser = useCallback(async () => {
    const { error } = await disconnectUserFromRace(userId, raceId);

    if (error) {
      toast.error(error);
      return;
    }

    // reset the stores
    resetTypingFieldStore();
    resetRaceStore();
  }, [userId, raceId, resetTypingFieldStore, resetRaceStore]);

  useEffect(() => {
    const handleBeforeUnload = () => {
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
    }, 150);
  }, []);

  // on component unmount, disconnect user from race
  useEffect(() => {
    return () => {
      if (mounted.current) {
        dcUser();
      }
    };
  }, [dcUser]);

  return null;
}
