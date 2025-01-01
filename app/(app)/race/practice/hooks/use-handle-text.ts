import { getText } from "@/app/actions/get-random-text";
import { useEffect } from "react";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { useToolbar } from "./use-toolbar";
import { toast } from "sonner";
import { generateRandomWords } from "../utils/generateRandomWords";

export function useHandleText() {
  const { setText, resetTypingFieldStore, setIsLoading } = useTypingFieldStore();
  const { currMode, textLength, randomWordsCount, includeNumbers, includeSymbols } = useToolbar();

  useEffect(() => {
    if (!currMode) return;

    resetTypingFieldStore();
    console.log("generate new text");

    if (currMode === "random-words") {
      const randomWords = generateRandomWords(randomWordsCount, includeNumbers, includeSymbols);
      setText(randomWords);
      return;
    }

    const generateNewText = async () => {
      setIsLoading(true);
      const { text, error } = await getText(currMode, textLength);
      setIsLoading(false);

      if (error) {
        toast.error(error);
        return;
      }

      if (!text) {
        toast.error("Failed to generate text");
        return;
      }

      setText(text);
    };

    generateNewText();
  }, [currMode, textLength, randomWordsCount, includeNumbers, includeSymbols]);
}
