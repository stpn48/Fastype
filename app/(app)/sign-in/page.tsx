"use client";

import { signInWithOAuth } from "@/app/actions/sign-in-with-oauth";
import { useCallback } from "react";
import { toast } from "sonner";

export default function SignInPage() {
  const handleGoogleClick = useCallback(async () => {
    const { error } = await signInWithOAuth("google");

    if (error) {
      toast.error(error);
    }
  }, []);

  return (
    <div>
      <button onClick={handleGoogleClick}>google</button>
    </div>
  );
}
