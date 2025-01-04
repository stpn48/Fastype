import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { UserDetails } from "@/types/types";

export async function getUser(): Promise<UserDetails | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [userDetails, error] = await catchError(
    prisma.user.findFirst({
      where: {
        id: user.id,
      },
      include: {
        stats: true,
        race_history: true,
      },
    }),
  );

  if (error) {
    console.error(error);
    return null;
  }

  if (!userDetails) {
    console.error("User details not found");
    return null;
  }

  return {
    ...user,
    ...userDetails,
  };
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

export async function getUserDetails(userId: string) {
  const [userDetails, error] = await catchError(
    prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        stats: true,
        race_history: true,
      },
    }),
  );

  if (error) {
    return null;
  }

  return userDetails;
}

export async function getTop10AllTimeWpmUsers() {
  const [users, error] = await catchError(
    prisma.user.findMany({
      orderBy: {
        stats: {
          avg_wpm_all_time: "desc",
        },
      },
      take: 10,
      select: {
        id: true,
        username: true,
        image_url: true,
        stats: true,
      },
    }),
  );

  if (error) {
    return null;
  }

  return users;
}
