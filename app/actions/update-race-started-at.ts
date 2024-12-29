"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";

export async function updateRaceStartedAt(raceId: string, startedAt: Date) {
  const [, error] = await catchError(
    prisma.race.update({
      where: { id: raceId },
      data: { started_at: startedAt },
    }),
  );

  if (error) {
    return { error };
  }

  return { error: null };
}
