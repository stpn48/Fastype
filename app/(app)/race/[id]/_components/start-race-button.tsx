"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { changeRaceStatus } from "@/app/actions/change-race-status";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

type Props = {
  raceId: string;
  setRaceStarted: (raceStarted: boolean) => void;
};

export function StartRaceButton({ raceId, setRaceStarted }: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    setLoading(true);
    setRaceStarted(true);
    const { error } = await changeRaceStatus(raceId, "closed");
    setLoading(false);

    if (error) {
      toast.error("error changing race status");
      return;
    }
  }, []);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          {loading && <Loader2 className="size-5 animate-spin" />}
          <span>Start Race</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to start the race?</AlertDialogTitle>
          <AlertDialogDescription>Make sure all your friends are ready !</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Don&apos;t start yet</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>Start</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
