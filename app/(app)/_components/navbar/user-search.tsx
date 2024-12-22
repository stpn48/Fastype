"use client";

import { getUsersByQuery } from "@/app/actions/get-users-by-query";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type UserSuggestion = {
  id: string;
  username: string;
};

type Props = {
  closeDialog: () => void;
};

export function UserSearch({ closeDialog }: Props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const { error, users } = await getUsersByQuery(query);
      setIsLoading(false);

      if (error) {
        toast.error(error);
        return;
      }

      if (users === null) {
        return;
      }

      const userSuggestions = users.map((user) => {
        return { id: user.id, username: user.username };
      });

      setSuggestions(userSuggestions);
    };

    if (!query) {
      return;
    }

    fetchUsers();
  }, [query]);

  return (
    <div className="flex flex-col gap-2">
      <Input placeholder="Search for user by username" onChange={(e) => setQuery(e.target.value)} />

      {suggestions.length > 0 && (
        <section className="flex flex-col gap-2 rounded-lg border border-border">
          {isLoading && (
            <div className="flex w-full justify-center">
              <Loader2 className="size-4 animate-spin" />
            </div>
          )}

          {suggestions.map((suggestion) => (
            <Link
              onClick={closeDialog}
              className="flex items-center p-2 first:rounded-t-lg last:rounded-b-lg hover:bg-secondary"
              href={`/profile/${suggestion.id}`}
              key={suggestion.id}
            >
              {suggestion.username}
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
