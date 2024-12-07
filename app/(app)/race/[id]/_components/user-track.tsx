import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clerkClient } from "@clerk/nextjs/server";
import React from "react";

type Props = {
  userClerkId: string;
  progress: number;
};

export async function UserTrack({ userClerkId, progress }: Props) {
  const clerk = await clerkClient();

  const clerkUser = await clerk.users.getUser(userClerkId);

  // todo use shadcn avatar component
  return (
    <div className="h-[50px] px-4 w-full flex relative items-center first:border-t-0 last:border-b-0 border-y border-border">
      <div className="absolute" style={{ left: "95%", transform: progress === 0 ? "translateX(0)" : progress === 100 ? "translateX(-100%)" : "translateX(-50%)" }}>
        <Avatar className="size-8">
          <AvatarImage src={clerkUser?.imageUrl} />
          <AvatarFallback>
            {clerkUser?.firstName?.charAt(0) ?? "U"}
            {clerkUser?.lastName?.charAt(0) ?? "N"}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
