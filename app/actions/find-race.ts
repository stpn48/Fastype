"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { findRaceBasedOnUserAvgWpm, getUserData, openNewRace } from "@/services/find-race";
import { currentUser } from "@clerk/nextjs/server";
import { Race } from "@prisma/client";

type Response = {
  error: string | null;
  race: Race | null;
};

export async function findRace(): Promise<Response> {
  // get clerk user
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthenticated", race: null };
  }

  // get user data from the db
  const { error: userDataError, userData } = await getUserData(user.id);

  if (userDataError) {
    return { error: userDataError, race: null };
  }

  if (!userData) {
    return { error: "User not found", race: null };
  }

  // find a race in users wpm range and status open
  const { race, error: findRaceError } = await findRaceBasedOnUserAvgWpm(
    userData.stats.avgWpmAllTime,
  );

  if (findRaceError) {
    return { error: findRaceError, race: null };
  }

  // if race found, and there is less than 10 users in there, check if the user is already in the race, if not join it if yes open a new one
  if (race && race.users.length < 10) {
    const userAlreadyInRace = race.users.some((u) => u.id === userData.id);

    // if user is already in the race, open a new one
    if (userAlreadyInRace) {
      const { race, error: openRaceError } = await openNewRace(userData);

      if (openRaceError) {
        return { error: openRaceError, race: null };
      }

      if (!race) {
        return { error: "Unexpected error opening race. Race not found", race: null };
      }

      return { error: null, race };
    }

    // user not in the race yet, calculate new avgWpm for the race with the new user
    const totalUsersWpm =
      race.users.reduce((acc, curr) => acc + curr.stats.avgWpmLast10Races, 0) +
      userData.stats.avgWpmAllTime;

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
              id: userData.id,
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
    const { race, error: openRaceError } = await openNewRace(userData);

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
