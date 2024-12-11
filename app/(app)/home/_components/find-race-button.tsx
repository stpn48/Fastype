"use client";

import { findRace } from "@/app/actions/find-race";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

type Props = {};

export function FindRaceButton({}: Props) {
  const [isFindingRace, setIsFindingRace] = useState(false);

  const router = useRouter();

  const handleClick = useCallback(async () => {
    setIsFindingRace(true);
    const { error, race } = await findRace();
    setIsFindingRace(false);

    if (error) {
      toast.error(error);
    }

    if (race) {
      toast.success("Race found");
      router.push(`/race/${race.id}`);
    }
  }, [router]);

  return (
    <Button
      disabled={isFindingRace}
      onClick={handleClick}
      className="z-10 flex h-10 w-full gap-2 text-base"
    >
      {isFindingRace && <Loader2 className="h-4 w-4 animate-spin" />}
      <p>Find Race</p>
    </Button>
  );
}
