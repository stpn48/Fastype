"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { getUserData } from "@/services/race";
import { currentUser } from "@clerk/nextjs/server";
import { Race } from "@prisma/client";

const WPM_THRESHOLD = 30;

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

  const { error: userDataError, userData } = await getUserData(user.id);

  if (userDataError) {
    return { error: userDataError, race: null };
  }

  if (!userData) {
    return { error: "User not found", race: null };
  }

  // find a race in users wpm range and status open
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
    }),
  );

  if (findRaceError) {
    return { error: findRaceError.message, race: null };
  }

  // if race found, and there is less than 10 users in there, add user to race
  if (race && race.users.length < 10) {
    const userAlreadyInRace = race.users.some((u) => u.id === userData.id);

    // TODO: remove user from the race and join a new one
    if (userAlreadyInRace) {
      return { error: null, race };
    }

    // Calculate new avgWpm after adding the new user
    const totalUsersWpm =
      race.users.reduce((acc, curr) => acc + curr.avgWpmLast10Races, 0) + userData.avgWpmAllTime;
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
          text: `Empty out your pockets, I need all that I get the millions, then I fall back Niggas chameleons, they'll change for some changeDays ain't the same, niggas switch for the fameLouis Vuitton, I'm in my bagGet high, then my memory gone, I've been hurtin'I rock like electric guitars, I be ragin'Countin' big knots, look like yellow pages`,
        },
      }),
    );

    if (createRaceError) {
      return { error: createRaceError.message, race: null };
    }

    if (!race) {
      return { error: "Unexpected error creating race. Race not found", race: null };
    }

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
    }, 20000);

    return { error: null, race };
  }

  return { error: null, race: null };
}
