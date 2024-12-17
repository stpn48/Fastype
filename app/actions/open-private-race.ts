"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/server/queries";
import { generateRaceText } from "@/services/services";

export async function openPrivateRace() {
  const user = await getUser();

  if (!user) {
    return { error: "User not found" };
  }

  const raceText = await generateRaceText();

  if (!raceText) {
    return { error: "Unexpected error generating race text", race: null };
  }

  if (user.raceId) {
    const [, disconnectUserError] = await catchError(
      prisma.race.update({
        where: {
          id: user.raceId,
        },
        data: {
          users: {
            disconnect: {
              id: user.id,
            },
          },
        },
      }),
    );

    if (disconnectUserError) {
      return { error: disconnectUserError.message, race: null };
    }
  }

  const [race, error] = await catchError(
    prisma.race.create({
      data: {
        authorId: user.id,
        type: "private",
        status: "waiting",
        text: raceText,
        avgWpm: 0,
        users: {
          connect: {
            id: user.id,
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
