"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/server/queries";

export async function joinUserToRace(raceId: string) {
  const user = await getUser();

  if (!user) {
    return { error: "User not found" };
  }

  const [race, error] = await catchError(
    prisma.race.update({
      where: {
        id: raceId,
      },
      data: {
        type: "private",
        avgWpm: 0,
        users: {
          connect: {
            id: user.id,
          },
        },
      },
      include: {
        users: {
          select: {
            id: true,
            clerkId: true,
            username: true,
            imageUrl: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
  );

  if (error) {
    return { error: error.message, race: null };
  }

  return { error: null, race };
}
