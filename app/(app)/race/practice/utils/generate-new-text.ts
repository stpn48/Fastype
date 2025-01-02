"use client";

import { getText } from "@/app/actions/get-random-text";
import { TypingFieldMode } from "@/types/types";
import { race_text_length } from "@prisma/client";
import { toast } from "sonner";

export async function generateNewText(
  currMode: TypingFieldMode,
  textLength: race_text_length,
  setIsLoading?: (val: boolean) => void,
) {
  setIsLoading?.(true);
  const { text, error } = await getText(currMode, textLength);
  setIsLoading?.(false);

  if (error) {
    toast.error(error);
    return null;
  }

  if (!text) {
    toast.error("Failed to generate text");
    return null;
  }

  return text;
}
