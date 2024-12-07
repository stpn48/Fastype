"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

const WPM_THRESHOLD = 30;

export async function findRace() {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthenticated" };
  }

  const userData = await prisma.user.findFirst({
    where: {
      id: user.id,
    },
    select: {
      avgWpmAllTime: true,
    },
  });

  if (userData === null) {
    return { error: "User not found" };
  }

  const race = await prisma.race.findFirst({
    where: {
      avgWpm: {
        lt: userData.avgWpmAllTime + WPM_THRESHOLD,
      },
    },
  });

  if (race) {
    return race;
  }
}
