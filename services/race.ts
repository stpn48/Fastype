import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import "server-only";

export async function getUserData(clerkId: string) {
  // get user data from db
  const [userData, userDataError] = await catchError(
    prisma.user.findFirst({
      where: {
        clerkId: clerkId,
      },
      select: {
        avgWpmAllTime: true,
        id: true,
      },
    }),
  );

  if (userDataError) {
    return { error: userDataError.message, userData: null };
  }

  if (userData === null) {
    return { error: "User not found", userData: null };
  }

  return { error: null, userData };
}
