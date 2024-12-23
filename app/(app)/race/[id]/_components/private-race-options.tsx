"use client";

import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { StartRaceButton } from "./start-race-button";

type Props = {
  raceId: string;
};

export function PrivateRaceOptions({ raceId }: Props) {
  const [raceStarted, setRaceStarted] = useState(false);

  const handleCopyLink = useCallback(() => {
    toast.info("Link copied to clipboard");
    navigator.clipboard.writeText(`${window.location.origin}/race/${raceId}`);
  }, [raceId]);

  if (raceStarted) return null;

  return (
    <div className="flex justify-center gap-2">
      <StartRaceButton raceId={raceId} setRaceStarted={setRaceStarted} />
      <Button variant="outline" onClick={handleCopyLink}>
        Copy Link
      </Button>
    </div>
  );
}
