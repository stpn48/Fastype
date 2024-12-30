import { TypingFieldMode } from "@/types/types";
import { createParser } from "nuqs";

export const parseAsTypingFieldMode = createParser({
  parse(queryValue: unknown): TypingFieldMode | null {
    const validModes: TypingFieldMode[] = ["quote", "random-words", "normal-text"];

    if (typeof queryValue === "string" && validModes.includes(queryValue as TypingFieldMode)) {
      return queryValue as TypingFieldMode;
    }
    // Return null if validation fails
    return null;
  },
  serialize(value: TypingFieldMode): string {
    return value.split("").join("");
  },
});
