"use client";

import { changeUserUsername } from "@/app/actions/change-user-username";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { useActionState, useCallback } from "react";
import { toast } from "sonner";

type Props = {
  closeDialog: () => void;
};

export function ChangeUsernameForm({ closeDialog }: Props) {
  const handleChangeUsername = useCallback(
    async (_: unknown, formData: FormData) => {
      const newUsername = formData.get("username") as string;

      const { error } = await changeUserUsername(newUsername);

      if (error) {
        return { error };
      }

      toast.info("Username changed successfully ! Enjoy your new username");
      closeDialog();

      return { error: null };
    },
    [closeDialog],
  );

  const [data, submitActon, isPending] = useActionState(handleChangeUsername, { error: null });

  return (
    <form className="flex flex-col gap-4" action={submitActon}>
      <div className="flex flex-col gap-2">
        <Input
          name="username"
          placeholder="New Username"
          disabled={isPending}
          pattern="^[a-zA-Z0-9_]+$"
        />
        {data.error && <p className="text-red-500">{data.error}</p>}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending && <Loader className="mr-2 size-4 animate-spin" />}
        Change
      </Button>
    </form>
  );
}
