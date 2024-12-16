import { UsersRound } from "lucide-react";
import { PlayWithFriendsButton } from "./play-with-friends-button";

export function PlayWithFriendsSection() {
  return (
    <section className="relative flex h-48 flex-col justify-between overflow-hidden rounded-lg border border-border p-6">
      <UsersRound
        strokeWidth={0.9}
        className="absolute -top-[0px] right-[20px] z-0 size-[150px] transform text-muted opacity-30"
      />

      <div className="z-10 flex flex-col">
        <h1 className="text-2xl font-bold">Race Against Friends</h1>
        <p className="text-muted-foreground">Play against your friends</p>
      </div>

      <PlayWithFriendsButton />
    </section>
  );
}
