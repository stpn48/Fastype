"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/server/queries";
import { user_config } from "@prisma/client";

export async function updateUserConfig(config: Partial<user_config>) {
  const user = await getUser();

  if (!user) {
    return { error: "User not found" };
  }

  const [, error] = await catchError(
    prisma.user_config.update({
      where: {
        user_id: user.id,
      },
      data: {
        ...config,
      },
    }),
  );

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
