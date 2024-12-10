import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { Stats, User } from "@prisma/client";
import "server-only";

export async function getUserData(clerkId: string) {
  // get user data from db
  const [userData, userDataError] = await catchError(
    prisma.user.findFirst({
      where: {
        clerkId: clerkId,
      },
      include: {
        stats: true,
      },
    }),
  );

  if (userDataError) {
    return { error: userDataError.message, userData: null };
  }

  if (userData === null) {
    return { error: "User not found", userData: null };
  }

  return { error: null, userData };
}

const WPM_THRESHOLD = 30;

export async function findRaceBasedOnUserAvgWpm(userAvgWpmAllTime: number) {
  const [race, findRaceError] = await catchError(
    prisma.race.findFirst({
      where: {
        status: "open",
        avgWpm: {
          lt: userAvgWpmAllTime + WPM_THRESHOLD,
          gt: userAvgWpmAllTime - WPM_THRESHOLD,
        },
      },
      include: {
        users: {
          include: {
            stats: true,
          },
        },
      },
    }),
  );

  if (findRaceError) {
    return { error: findRaceError.message, race: null };
  }

  return { error: null, race };
}

export async function openNewRace(userData: User & { stats: Stats }) {
  if (userData.raceId) {
    const { error: disconnectUserError } = await disconnectUserFromRace(
      userData.id,
      userData.raceId,
    );

    if (disconnectUserError) {
      return { error: disconnectUserError, race: null };
    }
  }

  const [race, createRaceError] = await catchError(
    prisma.race.create({
      data: {
        avgWpm: userData.stats.avgWpmAllTime,
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

export async function disconnectUserFromRace(userId: string, raceId: string) {
  const [, disconnectUserError] = await catchError(
    prisma.race.update({
      where: {
        id: raceId,
      },
      data: {
        users: {
          disconnect: {
            id: userId,
          },
        },
      },
    }),
  );

  if (disconnectUserError) {
    return { error: disconnectUserError.message };
  }

  return { error: null };
}
