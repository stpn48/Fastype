"use client";

import { openNewRace } from "@/app/actions/open-new-race";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function PlayWithFriendsButton() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleClick = useCallback(async () => {
    setIsLoading(true);

    toast.loading("Creating lobby...");
    const { error, race } = await openNewRace("private");

    toast.dismiss();

    if (error) {
      toast.error(error);
    }

    setIsLoading(false);
    if (race) {
      router.push(`/race/${race.id}`);
    }
  }, [router]);

  return (
    <Button disabled={isLoading} onClick={handleClick} className="z-10 h-10 w-full text-base">
      {isLoading && <Loader className="size-5 animate-spin" />}
      <span>Create Lobby</span>
    </Button>
  );
}
