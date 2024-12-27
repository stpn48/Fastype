"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import React from "react";

export function SignoutItem() {
  return (
    <DropdownMenuItem className="text-red-600" onClick={() => {}}>
      Sign out
    </DropdownMenuItem>
  );
}
