"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@prisma/client";
import { createClient, RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type Props = {
  imageUrl: string;
  firstName: string | null;
  lastName: string | null;
  clerkId: string;
};

export function AvatarProgress({ imageUrl, firstName, lastName, clerkId }: Props) {
  const [raceProgress, setRaceProgress] = useState(0);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  useEffect(() => {
    const channel = supabase
      .channel("user-progress")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "User",
          filter: `clerkId=eq.${clerkId}`,
        },
        (payload: RealtimePostgresUpdatePayload<User>) => {
          setRaceProgress(payload.new.raceProgress);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="flex min-w-fit justify-end px-4" style={{ width: `${raceProgress}%` }}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={imageUrl} />
        <AvatarFallback>
          {firstName?.charAt(0) ?? "U"}
          {lastName?.charAt(0) ?? "N"}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
