import { handleRaceFinish } from "@/app/actions/handle-race-finish";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { RaceType } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useRaceProgress(raceId: string, userId: string, raceType: RaceType) {
  const [raceProgress, setRaceProgress] = useState(0);

  const { resetTypingFieldStore, setCanType } = useTypingFieldStore();

  const router = useRouter();

  const handleRaceComplete = useCallback(async () => {
    setCanType(false);
    router.prefetch("/home");
    const { error } = await handleRaceFinish(Date.now(), raceId);
    resetTypingFieldStore();

    if (error) {
      toast.error(error);
    }

    router.push("/home");
  }, [router, userId, raceId, resetTypingFieldStore]);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const channel = supabase.channel(`race-${raceId}`, {
      config: {
        broadcast: { self: true },
      },
    });

    channel
      .on("broadcast", { event: "user-progress-update" }, (payload) => {
        const { progress, userId: progressUpdateUserId } = payload.payload;

        if (progressUpdateUserId === userId) {
          if (progress === 100) {
            handleRaceComplete();
            return;
          }

          setRaceProgress(progress);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, raceId, handleRaceComplete]);

  return { raceProgress };
}
