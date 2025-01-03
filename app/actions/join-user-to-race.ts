"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/server/queries";

export async function joinUserToRace(raceId: string) {
  const user = await getUser();

  if (!user) {
    return { error: "User not found" };
  }

  const [, error] = await catchError(
    prisma.race.update({
      where: {
        id: raceId,
      },
      data: {
        updated_at: new Date(),
        users: {
          connect: {
            id: user.id,
          },
        },
      },
    }),
  );

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
