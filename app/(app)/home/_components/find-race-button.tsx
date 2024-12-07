"use client";

import { findRace } from "@/app/actions/find-race";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

type Props = {};

export function FindRaceButton({}: Props) {
  const [isFindingRace, setIsFindingRace] = useState(false);

  const router = useRouter();

  const handleClick = useCallback(async () => {
    setIsFindingRace(true);
    const { error, race } = await findRace();
    setIsFindingRace(false);

    if (error) {
      console.error(error);
    }

    if (race) {
      router.push(`/race/${race.id}`);
    }
  }, [router]);

  return (
    <Button disabled={isFindingRace} onClick={handleClick} className="w-full h-10 z-10 text-base flex gap-2">
      {isFindingRace && <Loader2 className="w-4 h-4 animate-spin" />}
      <p>Find Race</p>
    </Button>
  );
}
