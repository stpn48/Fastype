"use client";

import { findRace } from "@/app/actions/find-race";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

type Props = {};

export function FindRaceButton({}: Props) {
  const router = useRouter();

  const handleClick = useCallback(async () => {
    // find a race, if no race found create a new race
    const { error, race } = await findRace();

    if (error) {
      console.error(error);
    }

    if (race) {
      router.push(`/race/${race.id}`);
    }
  }, [router]);

  return (
    <Button onClick={handleClick} className="w-full h-10 z-10 text-base">
      Find Race
    </Button>
  );
}
