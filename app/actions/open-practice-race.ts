"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/server/queries";
import { generateRaceText } from "@/services/services";

export async function openPracticeRace() {
  const user = await getUser();

  if (!user) {
    return { error: "Unauthenticated", race: null };
  }

  const raceText = await generateRaceText();

  if (!raceText) {
    return { error: "Unexpected error generating race text", race: null };
  }

  const [race, createRaceError] = await catchError(
    prisma.race.create({
      data: {
        status: "closed",
        text: raceText,
        type: "solo",
        avgWpm: user.stats.avgWpmAllTime,
        users: {
          connect: {
            id: user.id,
          },
        },
      },
    }),
  );

  if (createRaceError) {
    return { error: createRaceError.message, race: null };
  }

  if (!race) {
    return { error: "Unexpected error creating race. Race was somehow not created", race: null };
  }

  // delete race after 1.5 mins
  setTimeout(
    async () => {
      const [, deleteRaceError] = await catchError(
        prisma.race.update({ where: { id: race.id }, data: { status: "completed" } }),
      );

      if (deleteRaceError) {
        return { error: deleteRaceError.message, race: null };
      }
    },
    60 * 1000 * 1.5, // 1.5 mins
  );

  return { error: null, race };
}
