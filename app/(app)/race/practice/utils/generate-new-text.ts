"use client";

import { getText } from "@/app/actions/get-random-text";
import { TypingFieldMode } from "@/types/types";
import { race_text_length } from "@prisma/client";
import { toast } from "sonner";

export async function generateNewText(
  currMode: Exclude<TypingFieldMode, "random-words">,
  textLength: race_text_length,
) {
  const { text, error } = await getText(currMode, textLength);

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
