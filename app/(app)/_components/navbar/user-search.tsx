"use client";

import { getUsersByQuery } from "@/app/actions/get-users-by-query";
import { Input } from "@/components/ui/input";
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

  useEffect(() => {
    const fetchUsers = async () => {
      const { error, users } = await getUsersByQuery(query);

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

      // Store current suggestions as previous before updating
      setSuggestions(userSuggestions);
    };

    if (!query) {
      // When query is empty, show previous suggestions
      return;
    }

    fetchUsers();
  }, [query]);

  return (
    <div className="flex flex-col gap-2">
      <Input placeholder="Search for user by username" onChange={(e) => setQuery(e.target.value)} />

      {suggestions.length > 0 && (
        <section className="flex flex-col gap-2 rounded-lg border border-border">
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
