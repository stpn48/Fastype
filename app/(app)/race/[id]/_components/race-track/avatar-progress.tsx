"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as ClerkUserType } from "@clerk/backend";
import { User } from "@prisma/client";
import { createClient, RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type Props = {
  clerkUser: ClerkUserType;
};

export function AvatarProgress({ clerkUser }: Props) {
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
          filter: "clerkId=eq.clerk_user_id",
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
        <AvatarImage src={clerkUser.imageUrl} />
        <AvatarFallback>
          {clerkUser.firstName?.charAt(0) ?? "U"}
          {clerkUser.lastName?.charAt(0) ?? "N"}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
