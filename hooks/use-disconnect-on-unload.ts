"use client";

import { disconnectUserFromRace } from "@/app/actions/disconnect-user-from-race"; // Your server action
import { useEffect } from "react";
import { toast } from "sonner";
import { useTypingFieldStore } from "./zustand/use-typing-field";

export function useDisconnectOnUnload(userId: string, raceId: string) {
  const { resetTypingFieldStore } = useTypingFieldStore();

  useEffect(() => {
    const handleUnload = async () => {
      toast.loading("Disconnecting user from race...");
      await disconnectUserFromRace(userId, raceId);
      resetTypingFieldStore();
    };
    // Listen for beforeunload (browser refresh/close)
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [userId, raceId]);
}
