"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PencilLine } from "lucide-react";
import { useState } from "react";
import { ChangeUsernameForm } from "./change-username-form";

type Props = {};

export function ChangeUsernameDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <TooltipProvider>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Tooltip>
          <DialogTrigger asChild>
            <TooltipTrigger>
              <PencilLine className="size-4 text-muted-foreground hover:cursor-pointer" />
            </TooltipTrigger>
          </DialogTrigger>

          <TooltipContent>
            <p>Change username</p>
          </TooltipContent>
        </Tooltip>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Your Username</DialogTitle>
            <DialogDescription>
              Change your username to something more unique and personal.
            </DialogDescription>
          </DialogHeader>

          <ChangeUsernameForm closeDialog={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
