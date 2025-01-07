"use client";

import { changeUserUsername } from "@/app/actions/change-user-username";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function UsernameForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUsernameSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        setIsLoading(true);
        const form = e.currentTarget;
        const formData = new FormData(form);
        const username = formData.get("username") as string;

        if (!username?.trim()) {
          toast.error("Username is required");
          return;
        }

        if (username.length < 5) {
          toast.error("Username must be at least 5 characters long");
          return;
        }

        // Username format validation
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
          toast.error("Username can only contain letters, numbers and underscores");
          return;
        }

        const { error } = await changeUserUsername(username);

        if (error) {
          toast.error(error);
          return;
        }

        toast.success("Username set successfully!");
        router.push("/home");
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  return (
    <form className="flex w-full flex-col items-center gap-4" onSubmit={handleUsernameSubmit}>
      <div className="flex w-full flex-col items-center gap-1">
        <Input
          className="w-[80%]"
          disabled={isLoading}
          name="username"
          placeholder="Username"
          required
          minLength={5}
          pattern="^[a-zA-Z0-9_]+$"
        />
      </div>
      <Button className="w-[80%]" type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Setting username...
          </>
        ) : (
          "Continue"
        )}
      </Button>
    </form>
  );
}
