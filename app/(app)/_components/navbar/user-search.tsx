"use client";

import { getUsersByQuery } from "@/app/actions/get-users-by-query";
import { Input } from "@/components/ui/input";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import clsx from "clsx";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type UserSuggestion = {
  id: string;
  username: string | null;
};

export function UserSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);

  const { setCanType } = useTypingFieldStore();

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

      // Store current suggestions as previous before updating
      setSuggestions(users);
    };

    if (!query) {
      // When query is empty, show previous suggestions
      return;
    }

    fetchUsers();
  }, [query]);

  useEffect(() => {
    if (isSearching) {
      setCanType(false);
      return;
    }

    if (!isSearching) {
      setCanType(true);
      return;
    }
  }, [isSearching]);

  return (
    <>
      <button onClick={() => setIsSearching(!isSearching)}>
        <Search className="size-4" />
      </button>

      {isSearching && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10 h-screen w-screen bg-transparent"
            onClick={() => setIsSearching(false)}
          />

          {/* Search dialog */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed left-[50%] top-2 z-10 flex -translate-x-[50%] flex-col"
          >
            {/* Search input */}
            <Input
              autoFocus
              placeholder="Search for username"
              onChange={(e) => setQuery(e.target.value)}
              className="z-10 w-full max-w-[350px] rounded-b-none bg-background px-4 py-1"
            />

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <section className="flex flex-col rounded-lg rounded-t-none border border-t-0 border-border bg-background">
                {suggestions.map((suggestion) => (
                  <Link
                    onClick={() => setIsSearching(false)}
                    className={clsx(
                      "flex items-center p-2 last:rounded-b-lg hover:bg-secondary",
                      isLoading && "pointer-events-none opacity-50",
                    )}
                    href={`/profile/${suggestion.id}`}
                    key={suggestion.id}
                  >
                    {suggestion.username}
                  </Link>
                ))}
              </section>
            )}
          </motion.div>
        </>
      )}
    </>
  );
}
