"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";

export async function disconnectUserFromRace(userId: string, raceId: string) {
  const [, disconnectUserFromRaceError] = await catchError(
    prisma.race.update({
      where: {
        id: raceId,
      },
      data: {
        users: {
          disconnect: {
            id: userId,
          },
        },
      },
    }),
  );

  const [, resetUserRaceDetailsError] = await catchError(
    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        raceId: null,
      },
    }),
  );

  if (resetUserRaceDetailsError) {
    return { error: resetUserRaceDetailsError.message };
  }

  if (disconnectUserFromRaceError) {
    return { error: disconnectUserFromRaceError.message };
  }

  return { error: null };
}
