"use client";

import { Button } from "@/components/ui/button";
import { useCallback } from "react";

type Props = {};

export function FindRaceButton({}: Props) {
  const handleClick = useCallback(() => {
    // find a race, if no race found create a new race
  }, []);

  return (
    <Button onClick={handleClick} className="w-full h-10 z-10 text-base">
      Find Race
    </Button>
  );
}
