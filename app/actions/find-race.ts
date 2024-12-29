"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/server/queries";
import { findRaceBasedOnUserAvgWpm } from "@/services/services";
import { race } from "@prisma/client";
import { openNewRace } from "./open-new-race";

type Response = {
  error: string | null;
  race: race | null;
};

export async function findRace(): Promise<Response> {
  const user = await getUser();

  if (!user || !user.stats) {
    return { error: "Unauthenticated", race: null };
  }

  // user is in a race, open a new race
  if (user.race_id) {
    const { race, error: openRaceError } = await openNewRace("public");

    if (openRaceError) {
      return { error: openRaceError, race: null };
    }

    return { error: null, race };
  }

  // if user not in a race, find a race in users wpm range and status open
  const { race, error: findRaceError } = await findRaceBasedOnUserAvgWpm(
    user.stats.avg_wpm_all_time,
  );

  if (findRaceError) {
    return { error: findRaceError, race: null };
  }

  // if race found, and there is less than 10 users in there calc new avg wpm for the race with the new user and join him
  if (race && race.users.length < 10) {
    const totalUsersWpm =
      race.users.reduce((acc, curr) => acc + curr.stats!.avg_wpm_last_10_races, 0) +
      user.stats.avg_wpm_all_time;

    const newAvgWpm = totalUsersWpm / (race.users.length + 1);

    // join the race and update the avgWpm for the race
    const [, joinRaceError] = await catchError(
      prisma.race.update({
        where: {
          id: race.id,
        },
        data: {
          updated_at: new Date(),
          avg_wpm: newAvgWpm,
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
    const { race, error: openRaceError } = await openNewRace("public");

    if (openRaceError) {
      return { error: openRaceError, race: null };
    }

    return { error: null, race };
  }

  return { error: null, race: null };
}
