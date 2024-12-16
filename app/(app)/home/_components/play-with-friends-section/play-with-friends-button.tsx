"use client";

import { openPrivateRace } from "@/app/actions/open-private-race";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function PlayWithFriendsButton() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleClick = useCallback(async () => {
    setIsLoading(true);
    const { error, race } = await openPrivateRace();
    setIsLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    if (!race) {
      toast.error("Unexpected error creating race, please try again");
      return;
    }

    router.push(`/race/${race.id}`);
  }, [router]);

  return (
    <Button disabled={isLoading} onClick={handleClick} className="z-10 h-10 w-full text-base">
      {isLoading && <Loader2 className="size-5 animate-spin" />}
      <span>Create Lobby</span>
    </Button>
  );
}
