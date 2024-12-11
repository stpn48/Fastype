"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";

export async function getRaceUsers(raceId: string) {
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
