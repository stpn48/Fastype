import { completed_race, stats, user } from "@prisma/client";

import { User } from "@supabase/supabase-js";

export type Theme = "light" | "dark" | "dark-forest" | "rose";

export type TypingFieldMode = "quote" | "random-words" | "normal-text";

export type RaceUser = {
  id: string;
  username: string;
  image_url: string;
};

export type UserDetails = User &
  user & {
    stats: stats | null;
    race_history: completed_race[];
  };
