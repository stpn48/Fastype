import { completed_race, stats, user } from "@prisma/client";

import { User } from "@supabase/supabase-js";

export type Theme = "light" | "dark" | "dark-forest" | "rose";

export type UserDetails = User &
  user & {
    stats: stats;
    race_history: completed_race[];
  };
