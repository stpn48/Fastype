"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { TypingFieldMode } from "@/types/types";
import { race_text_length } from "@prisma/client";

type Response = Promise<{
  error?: string;
  text?: string;
}>;

export async function getText(textType: TypingFieldMode, length: race_text_length): Response {
  if (textType === "quote") {
    const [quotes, fetchQuotesError] = await catchError(
      prisma.race_text.findMany({
        where: {
          type: "quote",
          length: length,
        },
      }),
    );

    if (fetchQuotesError) {
      return { error: fetchQuotesError.message };
    }

    if (!quotes || quotes.length === 0) {
      return { error: "No quotes found" };
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);

    return { text: quotes[randomIndex].text };
  }

  if (textType === "text") {
    const [texts, fetchTextsError] = await catchError(
      prisma.race_text.findMany({
        where: {
          type: "text",
          length: length,
        },
      }),
    );

    if (fetchTextsError) {
      return { error: fetchTextsError.message };
    }

    if (!texts || texts.length === 0) {
      return { error: "No texts found" };
    }

    const randomIndex = Math.floor(Math.random() * texts.length);

    return { text: texts[randomIndex].text };
  }

  return { error: "Invalid text type" };
}
