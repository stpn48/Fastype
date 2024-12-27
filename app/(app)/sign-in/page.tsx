"use client";

import { signInWithOAuth } from "@/app/actions/sign-in-with-oauth";
import { createClient } from "@/lib/supabase/client";
import { useCallback } from "react";
import { toast } from "sonner";

export default function SignInPage() {
  const supabase = createClient();

  const handleGoogleClick = useCallback(async () => {
    const { error } = await signInWithOAuth("google");

    if (error) {
      toast.error(error);
    }
  }, []);

  return (
    <div>
      <button onClick={handleGoogleClick}>google</button>
      <button onClick={() => supabase.auth.signOut()}>sign out</button>
    </div>
  );
}
