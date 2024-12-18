"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/server/queries";
import { generateRaceText } from "@/services/services";
import { RaceType } from "@prisma/client";

const WAITING_FOR_PLAYERS_TIME = 1000 * 15; // 15 sec
const RACE_DURATION = 1000 * 60 * 1.5;

export async function openNewRace(raceType: RaceType) {
  const user = await getUser();

  if (!user || !user.stats) {
    return { error: "User not found" };
  }

  // dc user from the race hes in if he is in one
  if (user.raceId) {
    const [, disconnectUserError] = await catchError(
      prisma.race.update({
        where: {
          id: user.raceId,
        },
        data: {
          updatedAt: new Date(),
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
        authorId: raceType === "private" ? user.id : null,
        type: raceType,
        status: raceType === "solo" ? "closed" : "waiting",
        text: raceText,
        avgWpm: user.stats.avgWpmAllTime,
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

  if (raceType === "public") {
    // close race
    setTimeout(async () => {
      const [, updateRaceStatusError] = await catchError(
        prisma.race.update({
          where: {
            id: race.id,
          },
          data: {
            status: "closed",
          },
        }),
      );

      if (updateRaceStatusError) {
        return { error: updateRaceStatusError.message, race: null };
      }
    }, WAITING_FOR_PLAYERS_TIME);
  }

  if (raceType === "solo") {
    // delete race
    setTimeout(async () => {
      const [, deleteRaceError] = await catchError(
        prisma.race.delete({
          where: {
            id: race.id,
          },
        }),
      );

      if (deleteRaceError) {
        return { error: deleteRaceError.message, race: null };
      }
    }, RACE_DURATION);
  }

  return { error: null, race };
}