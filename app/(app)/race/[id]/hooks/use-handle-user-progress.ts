import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function useHandleUserProgress(text: string, userId: string, raceId: string) {
  const { userWords, setHasMistake } = useTypingFieldStore();

  const channel = useRef<RealtimeChannel | null>(null);
  const [channelSubscribed, setChannelSubscribed] = useState(false);

  const subscribeToRaceChannel = useCallback(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    // subscribe to this race's channel
    channel.current = supabase.channel(`race-${raceId}`, {
      config: {
        broadcast: { self: true },
      },
    });

    channel.current.subscribe((status) => {
      if (status === "SUBSCRIBED" && !channelSubscribed) {
        setChannelSubscribed(true);
      }
    });
  }, [raceId]);

  // send progress payload every time userWords change (user types)
  useEffect(() => {
    // subscribe to channel if not subscribed
    if (!channelSubscribed || !channel.current) {
      subscribeToRaceChannel();
      return;
    }

    const textWithoutSpaces = text.replace(/\s+/g, "");

    // don't send progress if user has mistake
    if (userWords.join("") !== textWithoutSpaces.slice(0, userWords.join("").length)) {
      setHasMistake(true);
      return;
    }

    const totalChars = textWithoutSpaces.length;
    const userChars = userWords.join("").length;
    const userProgress = (userChars / totalChars) * 100;

    setHasMistake(false);

    channel.current
      .send({
        type: "broadcast",
        event: `user-progress-update`,
        payload: {
          userId,
          progress: userProgress,
        },
      })
      .catch((error) => toast.error("Error sending progress update:", error));

    return () => {
      if (channel.current) {
        channel.current.unsubscribe();
      }
    };
  }, [userWords, channelSubscribed, userId, text, channel, subscribeToRaceChannel]);
}
