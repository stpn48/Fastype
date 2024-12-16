"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useClerk } from "@clerk/nextjs";
import React from "react";

export function SignoutItem() {
  const { signOut } = useClerk();

  return (
    <DropdownMenuItem className="text-red-600" onClick={() => signOut({ redirectUrl: "/" })}>
      Sign out
    </DropdownMenuItem>
  );
}
