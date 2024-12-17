"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/server/queries";
import { RaceStatus } from "@prisma/client";

export async function changeRaceStatus(raceId: string, status: RaceStatus) {
  const user = await getUser();

  if (!user) {
    return { error: "User not found", race: null };
  }

  const [, updateRaceStatusError] = await catchError(
    prisma.race.update({
      where: {
        id: raceId,
      },
      data: {
        status: status,
      },
    }),
  );

  if (updateRaceStatusError) {
    return { error: updateRaceStatusError.message, race: null };
  }

  return { error: null, race: null };
}