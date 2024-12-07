import { Button } from "@/components/ui/button";
import { UsersRound } from "lucide-react";

export function PlayWithFriendsSection() {
  return (
    <section className="h-48 relative overflow-hidden p-6 border rounded-lg flex flex-col justify-between border-border">
      <UsersRound strokeWidth={0.9} className="absolute size-[300px] -top-[60px] right-[20px] transform  text-muted opacity-30   z-0" />

      <div className="flex z-10 flex-col">
        <h1 className="text-2xl font-bold">Race Against Friends</h1>
        <p className="text-muted-foreground">Play against your friends</p>
      </div>
      <Button className="w-full z-10 h-10 text-base">Create Lobby</Button>
    </section>
  );
}
