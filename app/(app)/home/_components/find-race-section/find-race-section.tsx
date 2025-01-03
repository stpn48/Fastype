import { Earth } from "lucide-react";
import { FindRaceButton } from "./find-race-button";

export function FindRaceSection() {
  return (
    <section className="relative z-10 flex h-48 flex-col justify-between gap-4 overflow-hidden rounded-lg border border-border p-6">
      {/* <Earth
        strokeWidth={0.4}
        className="absolute -top-[160px] right-[20px] z-0 size-[600px] rotate-12 transform text-muted opacity-30"
      /> */}

      <div className="z-10 flex flex-col">
        <h1 className="text-2xl font-bold">Find Race</h1>
        <p className="text-muted-foreground">Race against other players</p>
      </div>

      <FindRaceButton />
    </section>
  );
}
