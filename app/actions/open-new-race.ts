"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/server/queries";
import { generateRaceText } from "@/services/services";
import { race, race_type } from "@prisma/client";

type Response = {
  error: string | null;
  race: race | null;
};

export async function openNewRace(raceType: race_type): Promise<Response> {
  const user = await getUser();

  if (!user || !user.stats) {
    return { error: "User not found", race: null };
  }

  // dc user from the race hes in if he is in one
  if (user.race_id) {
    const [, disconnectUserError] = await catchError(
      prisma.race.update({
        where: {
          id: user.race_id,
        },
        data: {
          updated_at: new Date(),
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

  // generate text
  const raceText = await generateRaceText();

  if (!raceText) {
    return { error: "Unexpected error generating race text", race: null };
  }

  // create race
  const [race, error] = await catchError(
    prisma.race.create({
      data: {
        author_id: raceType === "private" ? user.id : null,
        type: raceType,
        status: raceType === "solo" ? "closed" : "waiting",
        text: raceText,
        avg_wpm: user.stats.avg_wpm_all_time,
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

  if (!race) {
    return { error: "Unexpected error creating race. Race was not created", race: null };
  }

  return { error: null, race };
}
