"use server";

import { catchError } from "@/lib/catch-error";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/server/queries";
import { TypingFieldMode } from "@/types/types";
import { race, race_text_length, race_type } from "@prisma/client";
import { generateJSWords } from "../(app)/race/practice/utils/generate-js-words";
import { getText } from "./get-random-text";

type Response = {
  error: string | null;
  race: race | null;
};

export async function openNewRace(raceType: race_type): Promise<Response> {
  const user = await getUser();

  if (!user || !user.stats) {
    return { error: "User not found", race: null };
  }

  // dc user from the race hes in if he is in one
  if (user.race_id) {
    const [, disconnectUserError] = await catchError(
      prisma.race.update({
        where: {
          id: user.race_id,
        },
        data: {
          updated_at: new Date(),
          users: {
            disconnect: {
              id: user.id,
            },
          },
        },
      }),
    );

    if (disconnectUserError) {
      return { error: disconnectUserError.message, race: null };
    }
  }

  // generate text (choose random mode, and random length)
  const lengthChoices: Exclude<race_text_length[], "short"> = ["medium", "long"];
  const modeChoices: Exclude<TypingFieldMode, "random-words">[] = ["text", "quote", "javascript"];

  // Generate random indices
  const modeChoice = Math.floor(Math.random() * modeChoices.length);
  const lengthChoice = Math.floor(Math.random() * lengthChoices.length);

  let raceText: string | null = null;

  if (modeChoices[modeChoice] !== "javascript") {
    const { error: getTextError, text } = await getText(
      modeChoices[modeChoice],
      lengthChoices[lengthChoice],
    );

    if (getTextError) {
      return { error: getTextError, race: null };
    }

    if (!text) {
      return { error: "Unexpected error generating race text", race: null };
    }

    raceText = text;
  } else {
    // Mode is "javascript", generate random js syntax words (min 25, max 100)
    const randomWordsCount = Math.floor(Math.random() * 50) + 25;
    raceText = generateJSWords(randomWordsCount);
  }

  // create race
  const [race, error] = await catchError(
    prisma.race.create({
      data: {
        author_id: raceType === "private" ? user.id : null,
        type: raceType,
        status: "waiting",
        text: raceText,
        avg_wpm: user.stats.avg_wpm_all_time,
        users: {
          connect: {
            id: user.id,
          },
        },
      },
    }),
  );

  if (error) {
    return { error: error.message, race: null };
  }

  if (!race) {
    return { error: "Unexpected error creating race. Race was not created", race: null };
  }

  return { error: null, race };
}
