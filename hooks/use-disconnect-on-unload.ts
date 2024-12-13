"use client";

import { disconnectUserFromRace } from "@/app/actions/disconnect-user-from-race"; // Your server action to disconnect user
import { useEffect } from "react";

export function useDisconnectOnUnload(userId: string, raceId: string) {
  useEffect(() => {
    const handleUnload = async () => {
      await disconnectUserFromRace(userId, raceId);
    };

    // Register beforeunload event to disconnect the user when they leave or refresh the page
    window.addEventListener("beforeunload", handleUnload);

    // Cleanup on component unmount or when route changes
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [userId, raceId]);
}
