"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";

export async function getRandomText(textType: "random-words" | "quote" | "normal-text") {
  if (textType === "random-words") {
    return "hello hello hello hello hello";
    // setText(generateRandomWords(25));
  }

  if (textType === "quote") {
    const [quote, fetchQuoteError] = await catchError(
      prisma.race_text.aggregate({
        where: {
          type: "quote",
        },
        _count: {
          id: true,
        },
      }),
    );

    if (fetchQuoteError) {
      throw new Error(fetchQuoteError.message);
    }

    if (!quote || quote._count.id === 0) {
      throw new Error("No quote found");
    }

    const randomIndex = Math.floor(Math.random() * quote._count.id);

    const [randomQuote, fetchRandomQuoteError] = await catchError(
      prisma.race_text.findMany({
        where: {
          type: "quote",
        },
        skip: randomIndex,
        take: 1,
      }),
    );

    if (fetchRandomQuoteError) {
      throw new Error(fetchRandomQuoteError.message);
    }

    if (!randomQuote || randomQuote.length === 0) {
      throw new Error("No quote found");
    }

    return randomQuote[0].text;
  }

  if (textType === "normal-text") {
    const [normalText, fetchNormalTextError] = await catchError(
      prisma.race_text.aggregate({
        where: {
          type: "text",
        },
        _count: {
          id: true,
        },
      }),
    );

    if (fetchNormalTextError) {
      throw new Error(fetchNormalTextError.message);
    }

    if (!normalText || normalText._count.id === 0) {
      throw new Error("No normal text found");
    }

    const randomIndex = Math.floor(Math.random() * normalText._count.id);

    const [randomNormalText, fetchRandomNormalTextError] = await catchError(
      prisma.race_text.findMany({
        where: {
          type: "text",
        },
        skip: randomIndex,
        take: 1,
      }),
    );

    if (fetchRandomNormalTextError) {
      throw new Error(fetchRandomNormalTextError.message);
    }

    if (!randomNormalText || randomNormalText.length === 0) {
      throw new Error("No normal text found");
    }

    return randomNormalText[0].text;
  }
}
