import { TypingFieldMode } from "@/types/types";
import { race_text_length } from "@prisma/client";
import { createParser } from "nuqs";

export const parseAsTypingFieldMode = createParser({
  parse(queryValue: unknown): TypingFieldMode | null {
    const validModes: TypingFieldMode[] = ["quote", "random-words", "text", "javascript"];

    if (typeof queryValue === "string" && validModes.includes(queryValue as TypingFieldMode)) {
      return queryValue as TypingFieldMode;
    }
    // Return null if validation fails
    return null;
  },
  serialize(value: TypingFieldMode): string {
    return value;
  },
});

export const parseAsRaceTextLength = createParser({
  parse(queryValue: unknown): race_text_length | null {
    const validLengths: race_text_length[] = ["short", "medium", "long"];

    if (typeof queryValue === "string") {
      if (validLengths.includes(queryValue as race_text_length)) {
        return queryValue as race_text_length;
      }
    }

    return null;
  },
  serialize(value: race_text_length): string {
    return value;
  },
});
