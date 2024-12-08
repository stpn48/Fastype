"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function updateUserProgress(newProgress: number) {
  const clerkUser = await currentUser();

  // TODO: verify if newProgress is actually number
  if (typeof newProgress !== "number") {
    return { error: "newProgress is not a number" };
  }

  if (!clerkUser) {
    return { error: "Unauthenticated" };
  }

  const [, error] = await catchError(
    prisma.user.update({
      where: {
        clerkId: clerkUser.id,
      },
      data: {
        raceProgress: newProgress,
      },
    }),
  );

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
