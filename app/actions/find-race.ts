"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/server/queries";
import { findRaceBasedOnUserAvgWpm, openNewRace } from "@/services/services";
import { Race } from "@prisma/client";

type Response = {
  error: string | null;
  race: Race | null;
};

export async function findRace(): Promise<Response> {
  const user = await getUser();

  if (!user) {
    return { error: "Unauthenticated", race: null };
  }
  // user is in a race, disconnect him and continue
  if (user.raceId) {
    const { race, error: openRaceError } = await openNewRace(user);

    if (openRaceError) {
      return { error: openRaceError, race: null };
    }

    if (!race) {
      return { error: "Unexpected error opening race. Race not found", race: null };
    }

    return { error: null, race };
  }

  // fif user not in a race,ind a race in users wpm range and status open
  const { race, error: findRaceError } = await findRaceBasedOnUserAvgWpm(user.stats.avgWpmAllTime);

  if (findRaceError) {
    return { error: findRaceError, race: null };
  }

  // if race found, and there is less than 10 users in there, check if the user is already in the race, if not join it if yes open a new one
  if (race && race.users.length < 10) {
    const totalUsersWpm =
      race.users.reduce((acc, curr) => acc + curr.stats.avgWpmLast10Races, 0) +
      user.stats.avgWpmAllTime;

    const newAvgWpm = totalUsersWpm / (race.users.length + 1);

    // join the race and update the avgWpm for the race
    const [, joinRaceError] = await catchError(
      prisma.race.update({
        where: {
          id: race.id,
        },
        data: {
          avgWpm: newAvgWpm,
          users: {
            connect: {
              id: user.id,
            },
          },
        },
      }),
    );

    if (joinRaceError) {
      return { error: joinRaceError.message, race: null };
    }

    return { error: null, race };
  }

  // if no race found, open a new one
  if (!race) {
    const { race, error: openRaceError } = await openNewRace(user);

    if (openRaceError) {
      return { error: openRaceError, race: null };
    }

    if (!race) {
      return { error: "Unexpected error opening race. Race not found", race: null };
    }

    return { error: null, race };
  }

  return { error: null, race: null };
}
