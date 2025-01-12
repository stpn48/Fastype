import { completed_race, stats, user, user_config } from "@prisma/client";

import { User } from "@supabase/supabase-js";

export type TypingFieldMode = "quote" | "random-words" | "text" | "javascript";

export type RaceUser = {
  id: string;
  username: string;
  image_url: string;
};

export type UserDetails = User &
  user & {
    stats: stats | null;
    race_history: completed_race[];
    user_config: user_config | null;
  };
