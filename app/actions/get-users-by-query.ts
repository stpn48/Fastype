"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";

export async function getUsersByQuery(query: string) {
  const [users, error] = await catchError(
    prisma.user.findMany({
      where: {
        username: {
          contains: query,
        },
      },
      select: {
        id: true,
        username: true,
      },
    }),
  );

  if (error) {
    return { error: error.message, users: null };
  }

  return { error: null, users };
}
