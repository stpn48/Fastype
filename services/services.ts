import { disconnectUserFromRace } from "@/app/actions/disconnect-user-from-race";
import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { RaceText, Stats, User } from "@prisma/client";
import "server-only";

// service functions are utils for server actions. They should only be used in server actions !!!

export async function findRaceBasedOnUserAvgWpm(userAvgWpmAllTime: number) {
  const WPM_THRESHOLD = 30;

  const [race, findRaceError] = await catchError(
    prisma.race.findFirst({
      where: {
        type: "public",
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

  // generate a random text for the race
  const raceText = await generateRaceText();

  if (!raceText) {
    return { error: "Unexpected error generating race text", race: null };
  }

  // create the race TODO: generate a random text for the race here
  const [race, createRaceError] = await catchError(
    prisma.race.create({
      include: {
        users: true,
      },
      data: {
        avgWpm: userData.stats.avgWpmAllTime,
        users: {
          connect: {
            id: userData.id,
          },
        },
        text: raceText,
      },
    }),
  );

  if (createRaceError) {
    return { error: createRaceError.message, race: null };
  }

  if (!race) {
    return { error: "Unexpected error creating race. Race was not created", race: null };
  }

  // close race after 15 sec (waiting for players)
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

    // disconnect all users from the race and reset raceId
    race.users.forEach(async (user) => {
      await disconnectUserFromRace(user.id, race.id);
    });
  }, MAX_RACE_DURATION + WAITING_FOR_PLAYERS_TIME);

  return { error: null, race };
}

export async function generateRaceText() {
  const [raceTextCell, randomTextError] = await catchError(
    prisma.$queryRaw`SELECT * FROM "RaceText" ORDER BY RANDOM() LIMIT 1`,
  );

  if (randomTextError) {
    return null;
  }

  const raceTextCellType = raceTextCell as RaceText[];
  const raceText = raceTextCellType[0].text;

  return raceText;
}
