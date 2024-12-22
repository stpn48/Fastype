"use client";

import { disconnectUserFromRace } from "@/app/actions/disconnect-user-from-race";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

type Props = {
  userId: string;
  raceId: string;
};

export function DisconnectUserHandler({ userId, raceId }: Props) {
  const mounted = useRef(false);

  const dcUser = useCallback(async () => {
    toast.loading("Disconnecting user");
    await disconnectUserFromRace(userId, raceId);
    toast.dismiss();
    toast.success("User disconnected");
  }, [userId, raceId]);

  useEffect(() => {
    window.addEventListener("beforeunload", dcUser);

    return () => {
      window.removeEventListener("beforeunload", dcUser);
    };
  }, [dcUser]);

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
