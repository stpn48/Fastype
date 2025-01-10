"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { UserDetails } from "@/types/types";

export async function getUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [userData, error] = await catchError(
    prisma.user.findFirst({
      where: {
        id: user.id,
      },
      select: {
        user_config: true,
        username: true,
        image_url: true,
        stats: true,
        race_history: true,
      },
    }),
  );

  if (error || !userData) {
    return null;
  }

  return { ...userData, ...user };
}
