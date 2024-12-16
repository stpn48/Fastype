"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { useState } from "react";
import { UserSearch } from "./user-search";

export function SearchUsersDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Search className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search For Users</DialogTitle>
        </DialogHeader>

        <UserSearch closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
