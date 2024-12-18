"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/server/queries";
import { CompletedRace, Race, Stats, User } from "@prisma/client";
import { disconnectUserFromRace } from "./disconnect-user-from-race";

export async function handleRaceFinish(raceCompleteTimeMs: number, raceId: string) {
  const user = await getUser();

  if (!user) {
    return { error: "User not found" };
  }

  const [race, getRaceError] = await catchError(
    prisma.race.findUnique({
      where: {
        id: raceId,
      },
    }),
  );

  if (getRaceError || !race) {
    return { error: getRaceError?.message || "Race not found" };
  }

  const words = race.text.split(" ").length;
  let timeTypedSec = (raceCompleteTimeMs - race.createdAt.getTime()) / 1000;

  if (race.type === "public") {
    timeTypedSec -= 20; // remove 15 sec for waiting for players + countdown 5 sec
  } else if (race.type === "solo") {
    timeTypedSec -= 3; // remove 3 sec for countdown
  }

  const wpm = Math.round((words / timeTypedSec) * 60);

  // add race to user race history
  const { error: addRaceToUserHistoryError } = await addRaceToUserHistory(user.id, wpm);

  if (addRaceToUserHistoryError) {
    return { error: addRaceToUserHistoryError };
  }

  // update user stats
  const { error: updateUserStatsError } = await updateUserStats(user, wpm);

  if (updateUserStatsError) {
    return { error: updateUserStatsError };
  }

  // dc from race
  const { error: disconnectUserFromRaceError } = await disconnectUserFromRace(user.id, raceId);

  if (disconnectUserFromRaceError) {
    return { error: disconnectUserFromRaceError };
  }

  return { error: null };
}

async function addRaceToUserHistory(userId: string, wpm: number) {
  const [, updateStatsError] = await catchError(
    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        raceHistory: {
          create: {
            wpm: wpm,
          },
        },
      },
    }),
  );

  if (updateStatsError) {
    return { error: updateStatsError.message };
  }

  return { error: null };
}

async function updateUserStats(
  user: User & { stats: Stats | null } & { raceHistory: CompletedRace[] } & { Race: Race | null },
  wpm: number,
) {
  // Calculate average WPM
  const totalUserWpm = user.raceHistory.reduce((sum, race) => sum + race.wpm, 0) + wpm;
  const newAverageWpm = Math.round(totalUserWpm / (user.raceHistory.length + 1));

  // Last 10 races WPM
  const last10Races = [...user.raceHistory.slice(-9), { wpm }]; // Include the latest race
  const totalLast10RacesWpm = last10Races.reduce((sum, race) => sum + race.wpm, 0);
  const newLast10RacesAvgWpm = Math.round(totalLast10RacesWpm / last10Races.length);

  // all time best wpm
  let newAllTimeBestWpm = user.stats?.bestRaceWpm || 0;
  if (wpm > newAllTimeBestWpm) {
    newAllTimeBestWpm = wpm;
  }

  //update the stats
  const [, updateStatsError] = await catchError(
    prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        stats: {
          update: {
            avgWpmAllTime: newAverageWpm,
            avgWpmLast10Races: newLast10RacesAvgWpm,
            bestRaceWpm: newAllTimeBestWpm,
            lastRaceWpm: wpm,
          },
        },
      },
    }),
  );

  if (updateStatsError) {
    return { error: updateStatsError.message };
  }

  return { error: null };
}
