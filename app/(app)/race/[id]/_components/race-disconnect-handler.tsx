"use client";

import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { useEffect } from "react";

type Props = {};

export function RaceDisconnectHandler({}: Props) {
  const { resetTypingFieldStore } = useTypingFieldStore();

  useEffect(() => {
    return () => {
      // TODO: Disconnect from race on unmount
      resetTypingFieldStore();
    };
  }, []);

  return null;
}
