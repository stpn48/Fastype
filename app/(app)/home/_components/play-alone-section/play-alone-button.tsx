"use client";

import { openNewRace } from "@/app/actions/open-new-race";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function PlayAloneButton() {
  const [isOpeningRace, setIsOpeningRace] = useState(false);

  const router = useRouter();

  const handleClick = useCallback(async () => {
    setIsOpeningRace(true);

    toast.loading("Creating race...");

    const { error, race } = await openNewRace("solo");

    toast.dismiss();

    if (error) {
      toast.error(error);
    }

    if (race) {
      router.push(`/race/${race.id}`);
      setIsOpeningRace(false);
    }
  }, [router]);

  return (
    <Button
      onClick={handleClick}
      disabled={isOpeningRace}
      className="z-10 flex h-10 w-full gap-2 text-base"
    >
      {isOpeningRace && <Loader2 className="h-4 w-4 animate-spin" />}
      <p>Practice</p>
    </Button>
  );
}
