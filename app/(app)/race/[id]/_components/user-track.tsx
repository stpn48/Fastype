import { prisma } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import React from "react";
import { AvatarProgress } from "./avatar-progress";

type Props = {
  userId: string;
  userClerkId: string;
};

export async function UserTrack({ userId, userClerkId }: Props) {
  const clerk = await clerkClient();

  const clerkUser = await clerk.users.getUser(userClerkId);

  const userData = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      raceProgress: true,
    },
  });

  if (!userData || !clerkUser) {
    return null;
  }

  // todo use shadcn avatar component
  return (
    <div className="relative flex h-[50px] w-full items-center border-y border-border first:border-t-0 last:border-b-0">
      <AvatarProgress
        firstName={clerkUser.firstName || "U"}
        lastName={clerkUser.lastName || "N"}
        imageUrl={clerkUser.imageUrl}
      />
    </div>
  );
}
