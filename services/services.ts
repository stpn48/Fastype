import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { race_text } from "@prisma/client";
import "server-only";

// service functions are utils for server actions. They should only be used in server actions !!!

export async function findRaceBasedOnUserAvgWpm(userAvgWpmAllTime: number) {
  const WPM_THRESHOLD = 30;

  const [race, findRaceError] = await catchError(
    prisma.race.findFirst({
      where: {
        type: "public",
        status: "waiting",
        avg_wpm: {
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

export async function generateRaceText() {
  const [raceTextCell, randomTextError] = await catchError(
    prisma.$queryRaw`SELECT * FROM "race_text" ORDER BY RANDOM() LIMIT 1`,
  );

  if (randomTextError) {
    return null;
  }

  const raceTextCellType = raceTextCell as race_text[];
  const raceText = raceTextCellType[0].text;

  return raceText;
}
