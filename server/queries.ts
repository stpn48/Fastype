import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const [userData, userDataError] = await catchError(
    prisma.user.findUnique({
      where: {
        clerkId: clerkUser.id,
      },
      include: {
        Race: true,
      },
    }),
  );

  if (!userData || userDataError) {
    return null;
  }

  return { ...clerkUser, ...userData };
}

export async function getUserData(userId: string) {
  const [userData, error] = await catchError(
    prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        raceProgress: true,
      },
    }),
  );

  if (error) {
    return null;
  }

  return userData;
}

export async function getRaceDetails(raceId: string) {
  const [raceDetails, error] = await catchError(
    prisma.race.findUnique({
      where: {
        id: raceId,
      },
      include: {
        users: true,
      },
    }),
  );

  if (error) {
    return null;
  }

  return raceDetails;
}
