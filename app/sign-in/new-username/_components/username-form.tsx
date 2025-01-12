"use client";

import { changeUserUsername } from "@/app/actions/change-user-username";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useCallback } from "react";
import { toast } from "sonner";

export default function UsernameForm() {
  const router = useRouter();

  const handleUsernameSubmit = useCallback(
    async (_: unknown, formData: FormData) => {
      const username = formData.get("username") as string;

      const { error } = await changeUserUsername(username);

      if (error) {
        return { error };
      }

      toast.success("Username set successfully!");
      router.push("/home");

      return { error: null };
    },
    [router],
  );

  const [data, submitAction, isPending] = useActionState(handleUsernameSubmit, { error: null });

  return (
    <form className="flex w-full flex-col gap-4" action={submitAction}>
      <div className="flex w-full flex-col gap-2">
        <Input
          disabled={isPending}
          name="username"
          placeholder="Username"
          required
          minLength={5}
          pattern="^[a-zA-Z0-9_]+$"
        />
        {data.error && <p className="text-red-500">{data.error}</p>}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
        Set Username
      </Button>
    </form>
  );
}
