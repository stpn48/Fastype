import { Button } from "@/components/ui/button";
import { Earth } from "lucide-react";

export function FindRaceSection() {
  return (
    <section className="h-48 p-6 flex flex-col relative justify-between overflow-hidden gap-4 border z-10 border-border rounded-lg">
      <Earth strokeWidth={0.9} className="absolute size-[600px] -top-[160px] right-[20px] transform rotate-12 text-muted opacity-30 z-0" />

      <div className="flex z-10 flex-col">
        <h1 className="text-2xl font-bold">Find Race</h1>
        <p className="text-muted-foreground">Race against other players</p>
      </div>
      <Button className="w-full h-10 z-10 text-base">Find Race</Button>
    </section>
  );
}
