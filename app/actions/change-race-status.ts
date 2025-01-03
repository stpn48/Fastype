"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/server/queries";
import { race_status } from "@prisma/client";

export async function changeRaceStatus(raceId: string, status: race_status) {
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
