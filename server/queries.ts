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
        stats: true,
        raceHistory: true,
      },
    }),
  );

  if (!userData || userDataError) {
    if (userDataError) {
      console.error(userDataError.message);
      return null;
    }

    console.error("User not found");
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
    }),
  );

  if (error) {
    return null;
  }

  return raceDetails;
}

export async function getUserDetails(userId: string) {
  const [userDetails, error] = await catchError(
    prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        stats: true,
        raceHistory: true,
      },
    }),
  );

  if (error) {
    return null;
  }

  return userDetails;
}
