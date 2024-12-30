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
