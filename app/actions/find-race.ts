"use server";

import { catchError } from "@/lib/catch-error";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { Race } from "@prisma/client";

const WPM_THRESHOLD = 30;

type Response = {
  error: string | null;
  race: Race | null;
};

export async function findRace(): Promise<Response> {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthenticated", race: null };
  }

  const [userData, userDataError] = await catchError(
    prisma.user.findFirst({
      where: {
        clerkId: user.id,
      },
      select: {
        avgWpmAllTime: true,
        id: true,
      },
    })
  );

  if (userDataError) {
    return { error: userDataError.message, race: null };
  }

  if (userData === null) {
    return { error: "User not found", race: null };
  }

  const [race, findRaceError] = await catchError(
    prisma.race.findFirst({
      where: {
        status: "open",
        avgWpm: {
          lt: userData.avgWpmAllTime + WPM_THRESHOLD,
          gt: userData.avgWpmAllTime - WPM_THRESHOLD,
        },
      },
      include: {
        users: true,
      },
    })
  );

  if (findRaceError) {
    return { error: findRaceError.message, race: null };
  }

  // if race found, and there is less than 10 users in there, add user to race
  if (race && race.users.length < 10) {
    const userAlreadyInRace = race.users.some((u) => u.id === userData.id);

    if (userAlreadyInRace) {
      return { error: "User is already in the race", race };
    }

    // Calculate new avgWpm after adding the new user
    const totalUsersWpm = race.users.reduce((acc, curr) => acc + curr.avgWpmLast10Races, 0) + userData.avgWpmAllTime;
    const newAvgWpm = totalUsersWpm / (race.users.length + 1);

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
      })
    );

    if (joinRaceError) {
      return { error: joinRaceError.message, race: null };
    }

    return { error: null, race };
  }

  // if no race found, create a new one
  if (!race) {
    const [race, createRaceError] = await catchError(
      prisma.race.create({
        data: {
          avgWpm: userData.avgWpmAllTime,
          users: {
            connect: {
              id: userData.id,
            },
          },
          text: "random ass text todo bro",
        },
      })
    );

    if (createRaceError) {
      return { error: createRaceError.message, race: null };
    }

    return { error: null, race };
  }

  return { error: null, race: null };
}
