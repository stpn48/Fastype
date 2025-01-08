import { RealtimeChannel } from "@supabase/supabase-js";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]; // Create a shallow copy to avoid mutating the original array
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }
  return shuffled;
}

export async function subscribeToChannel(channel: RealtimeChannel, onSubscribe?: () => void) {
  return await new Promise<boolean>((resolve) => {
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        onSubscribe?.();
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}
