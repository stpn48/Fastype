"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { User } from "@prisma/client";
import { RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type Props = {
  firstName: string;
  lastName: string;
  imageUrl: string;
};

export function AvatarProgress({ firstName, lastName, imageUrl }: Props) {
  const [raceProgress, setRaceProgress] = useState(0);

  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("user")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "User" },
        (payload: RealtimePostgresUpdatePayload<User>) => setRaceProgress(payload.new.raceProgress),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex min-w-fit justify-end px-4" style={{ width: raceProgress + "%" }}>
      <Avatar className="size-8">
        <AvatarImage src={imageUrl} />
        <AvatarFallback>
          {firstName.charAt(0) ?? "U"}
          {lastName.charAt(0) ?? "N"}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
