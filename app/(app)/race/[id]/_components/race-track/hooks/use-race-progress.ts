import { handleRaceFinish } from "@/app/actions/handle-race-finish";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useRaceProgress(raceId: string, userId: string) {
  const [raceProgress, setRaceProgress] = useState(0);

  const router = useRouter();

  const handleRaceComplete = useCallback(async () => {
    const { error } = await handleRaceFinish(userId, Date.now(), raceId);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success("Race completed, stats updated, disconnecting from race");
    router.push("/home");
  }, [router, userId, raceId]);

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
  }, [userId, raceId]);

  return { raceProgress };
}
