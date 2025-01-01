"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/server/queries";
import { completed_race, stats, user } from "@prisma/client";

export async function handleRaceFinish(finalWpm: number) {
  const user = await getUser();

  if (!user) {
    return { error: "User not found" };
  }

  // add race to user race history
  const { error: addRaceToUserHistoryError } = await addRaceToUserHistory(user.id, finalWpm);

  if (addRaceToUserHistoryError) {
    return { error: addRaceToUserHistoryError };
  }

  // update user stats
  const { error: updateUserStatsError } = await updateUserStats(user, finalWpm);

  if (updateUserStatsError) {
    return { error: updateUserStatsError };
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
        race_history: {
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
  user: user & { stats: stats | null } & { race_history: completed_race[] },
  wpm: number,
) {
  // Calculate average WPM
  const totalUserWpm = user.race_history.reduce((sum, race) => sum + race.wpm, 0) + wpm;
  const newAverageWpm = Math.round(totalUserWpm / (user.race_history.length + 1));

  // Last 10 races WPM
  const last10Races = [...user.race_history.slice(-9), { wpm }]; // Include the latest race
  const totalLast10RacesWpm = last10Races.reduce((sum, race) => sum + race.wpm, 0);
  const newLast10RacesAvgWpm = Math.round(totalLast10RacesWpm / last10Races.length);

  // all time best wpm
  let newAllTimeBestWpm = user.stats?.best_race_wpm || 0;

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
            avg_wpm_all_time: newAverageWpm,
            avg_wpm_last_10_races: newLast10RacesAvgWpm,
            best_race_wpm: newAllTimeBestWpm,
            last_race_wpm: wpm,
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
