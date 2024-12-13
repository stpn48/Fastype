import { disconnectUserFromRace } from "@/app/actions/disconnect-user-from-race";
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

export async function findRaceBasedOnUserAvgWpm(userAvgWpmAllTime: number) {
  const WPM_THRESHOLD = 30;

  const [race, findRaceError] = await catchError(
    prisma.race.findFirst({
      where: {
        status: "waiting",
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
  const WAITING_FOR_PLAYERS_TIME = 15 * 1000; // 15 secs
  const MAX_RACE_DURATION = 60 * 1000 * 1.5; // 1.5 mins

  // if user is in a race disconnect him and continue
  if (userData.raceId) {
    const { error: disconnectUserError } = await disconnectUserFromRace(
      userData.id,
      userData.raceId,
    );

    if (disconnectUserError) {
      return { error: disconnectUserError, race: null };
    }
  }

  // create the race TODO: generate a random text for the race here
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
    return { error: "Unexpected error creating race. Race was not created", race: null };
  }

  // close race after 15 sec
  setTimeout(async () => {
    // close race
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

  // finish race after some time
  setTimeout(async () => {
    const [, updateRaceStatusError] = await catchError(
      prisma.race.update({
        where: {
          id: race.id,
        },
        data: {
          status: "completed",
        },
      }),
    );

    if (updateRaceStatusError) {
      return { error: updateRaceStatusError.message, race: null };
    }

    // disconnect all users from the race
    const [, raceUsersError] = await catchError(
      prisma.user.updateMany({
        where: {
          raceId: race.id,
        },
        data: {
          raceId: null,
        },
      }),
    );

    if (raceUsersError) {
      return { error: raceUsersError.message, race: null };
    }
  }, MAX_RACE_DURATION + WAITING_FOR_PLAYERS_TIME);

  return { error: null, race };
}
