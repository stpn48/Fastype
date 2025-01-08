"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/server/queries";

export async function getRaceUsers(raceId: string) {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthenticated");
  }

  const [raceUsers, error] = await catchError(
    prisma.user.findMany({
      where: {
        race_id: raceId,
      },
      select: {
        id: true,
        username: true,
        image_url: true,
      },
    }),
  );

  if (error) {
    return null;
  }

  return raceUsers;
}
