"use client";

import { disconnectUserFromRace } from "@/app/actions/disconnect-user-from-race"; // Your server action
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function useDisconnectOnUnload(userId: string, raceId: string) {
  const pathname = usePathname(); // Hook to get the current route

  useEffect(() => {
    const handleUnload = async () => {
      toast.loading("Disconnecting user from race...");
      await disconnectUserFromRace(userId, raceId);
    };
    // Listen for beforeunload (browser refresh/close)
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [userId, raceId, pathname]);
}
