"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";

export function SignoutItem() {
  const router = useRouter();

  const supabase = createClient();
  const handleClick = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  }, [router, supabase]);

  return (
    <DropdownMenuItem className="text-red-600" onClick={handleClick}>
      Sign out
    </DropdownMenuItem>
  );
}
