"use client";

import { changeRaceStatus } from "@/app/actions/change-race-status";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function StartRaceButton({ raceId }: { raceId: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    setLoading(true);
    const { error } = await changeRaceStatus(raceId, "closed");
    setLoading(false);

    if (error) {
      toast.error("error changing race status");
      return;
    }
  }, []);

  return (
    <Button className="absolute -bottom-16 left-1/2 -translate-x-1/2" onClick={handleClick}>
      {loading && <Loader2 className="size-5 animate-spin" />}
      <span>Start Race</span>
    </Button>
  );
}
