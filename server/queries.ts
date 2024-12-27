import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function getUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
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
