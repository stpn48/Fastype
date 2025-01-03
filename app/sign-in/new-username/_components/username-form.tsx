"use client";

import { changeUserUsername } from "@/app/actions/change-user-username";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function UsernameForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();

  const handleUsernameSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      const username = formData.get("username") as string;

      try {
        const { error } = await changeUserUsername(username);

        if (error) {
          setErrorMsg(error);
          toast.error(error);
          return;
        }

        router.push("/home");
      } catch (err) {
        console.error(err);
        toast.error("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  // clear error message after 3 seconds
  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => {
        setErrorMsg(null);
      }, 3000);
    }
  }, [errorMsg]);

  return (
    <form className="flex w-full flex-col items-center gap-4" onSubmit={handleUsernameSubmit}>
      <div className="flex w-full flex-col items-center gap-1">
        <Input
          className={clsx("w-[80%]", errorMsg && "border-red-500")}
          disabled={isLoading}
          name="username"
          placeholder="Username"
        />
        {errorMsg && <p className="w-[80%] text-left text-xs text-red-500">{errorMsg}</p>}
      </div>
      <Button className="w-[80%]" type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <span>Continue</span>
      </Button>
    </form>
  );
}
