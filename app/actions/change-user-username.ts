"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/server/queries";
import { revalidatePath } from "next/cache";

export async function changeUserUsername(username: string) {
  const user = await getUser();

  if (!user) {
    return { error: "unauthorized" };
  }

  if (!username || typeof username !== "string") {
    return { error: "Invalid username" };
  }

  if (username.length < 5) {
    return { error: "Username must be at least 5 characters long" };
  }

  // check if username already exists
  const [alreadyExists, findUsernameError] = await catchError(
    prisma.user.findUnique({
      where: { username },
    }),
  );

  if (findUsernameError) {
    return { error: "failed to find username" };
  }

  if (alreadyExists) {
    return { error: "username already exists" };
  }

  // if not exists, update username
  const [, error] = await catchError(
    prisma.user.update({
      where: { id: user.id },
      data: { username },
    }),
  );

  if (error) {
    return { error: "failed to update username" };
  }

  revalidatePath("/");
  return { error: null };
}
