"use client";

import { changeUserUsername } from "@/app/actions/change-user-username";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { FormEvent, useCallback, useState } from "react";
import { toast } from "sonner";

type Props = {
  closeDialog: () => void;
};

export function ChangeUsernameForm({ closeDialog }: Props) {
  const [isPending, setIsPending] = useState(false);

  const handleChangeUsername = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        setIsPending(true);
        const form = e.currentTarget;
        const formData = new FormData(form);
        const newUsername = formData.get("username") as string;

        if (!newUsername || typeof newUsername !== "string") {
          toast.error("Invalid username");
          return;
        }

        if (newUsername.length < 5) {
          toast.error("Your new username must be longer than 5 characters");
          return;
        }

        const { error } = await changeUserUsername(newUsername);

        if (error) {
          toast.error(error);
          return;
        }

        toast.info("Username changed successfully ! Enjoy your new username");
        closeDialog();
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsPending(false);
      }
    },
    [closeDialog],
  );

  return (
    <form className="flex flex-col gap-4" onSubmit={handleChangeUsername}>
      <Input
        name="username"
        placeholder="New Username"
        required
        minLength={5}
        disabled={isPending}
        pattern="^[a-zA-Z0-9_]+$"
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader className="mr-2 size-4 animate-spin" />
            Changing...
          </>
        ) : (
          "Change"
        )}
      </Button>
    </form>
  );
}
