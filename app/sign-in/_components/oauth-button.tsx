"use client";

import { signInWithOAuth } from "@/app/actions/sign-in-with-oauth";
import { GithubIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

type Props = {
  provider: "google" | "github";
};

export function OAuthButton({ provider }: Props) {
  const router = useRouter();

  const handleClick = useCallback(async () => {
    const { error, url } = await signInWithOAuth(provider);

    if (error) {
      toast.error(error);
    }

    if (url) {
      router.push(url);
    }
  }, [router]);

  return (
    <Button
      className="flex h-fit w-full items-center gap-3 py-3 text-base"
      variant={"outline"}
      onClick={handleClick}
    >
      {provider === "google" ? (
        <GoogleIcon className="size-5" />
      ) : (
        <GithubIcon className="size-5" />
      )}
      <span>Continue with {provider.charAt(0).toUpperCase() + provider.slice(1)}</span>
    </Button>
  );
}
