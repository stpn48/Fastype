import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { supabaseJsClient } from "@/lib/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function useHandleUserProgress(text: string, userId: string, raceId: string) {
  const { userWords, setHasMistake } = useTypingFieldStore();

  const channel = useRef<RealtimeChannel | null>(null);
  const [channelSubscribed, setChannelSubscribed] = useState(false);

  const subscribeToRaceChannel = useCallback(() => {
    // subscribe to this race's channel
    channel.current = supabaseJsClient.channel(`race-${raceId}`, {
      config: {
        broadcast: { self: true },
      },
    });

    channel.current.subscribe((status) => {
      if (status === "SUBSCRIBED" && !channelSubscribed) {
        setChannelSubscribed(true);
      }
    });
  }, [raceId, channelSubscribed]);

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
        supabaseJsClient.removeChannel(channel.current);
      }
    };
  }, [userWords, channelSubscribed, userId, text, channel, subscribeToRaceChannel]);
}
