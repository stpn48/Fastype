"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/server/queries";

export async function getRaceUsers(raceId: string) {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthenticated");
  }

  const [raceDetails, error] = await catchError(
    prisma.user.findMany({
      where: {
        raceId: raceId,
      },
      select: {
        id: true,
        clerkId: true,
        imageUrl: true,
        firstName: true,
        lastName: true,
      },
    }),
  );

  if (error) {
    return null;
  }

  return raceDetails;
}
