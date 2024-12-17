"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";

export async function disconnectUserFromRace(userId: string, raceId: string) {
  //TODO: more security
  const [user, getUserError] = await catchError(prisma.user.findUnique({ where: { id: userId } }));

  const [race, getRaceError] = await catchError(prisma.race.findUnique({ where: { id: raceId } }));

  if (!race) {
    return { error: "Race not found" };
  }

  if (!user) {
    return { error: "User not found" };
  }

  if (getUserError || getRaceError) {
    return { error: "Unexpected error getting user or race" };
  }

  // If the race has author its a private race, if the author leaves the page, delete the race
  if (race.authorId === user.id) {
    const [, deleteRaceError] = await catchError(
      prisma.race.delete({
        where: {
          id: raceId,
        },
      }),
    );

    if (deleteRaceError) {
      return { error: deleteRaceError.message };
    }

    return { error: null };
  }

  const [, disconnectUserFromRaceError] = await catchError(
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

  if (disconnectUserFromRaceError) {
    return { error: disconnectUserFromRaceError.message };
  }

  // const [, resetUserRaceDetailsError] = await catchError(
  //   prisma.user.update({
  //     where: {
  //       id: userId,
  //     },
  //     data: {
  //       raceId: null,
  //     },
  //   }),
  // );

  // if (resetUserRaceDetailsError) {
  //   return { error: resetUserRaceDetailsError.message };
  // }

  return { error: null };
}
