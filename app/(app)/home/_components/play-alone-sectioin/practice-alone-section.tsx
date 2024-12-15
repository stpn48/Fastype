import { BookOpen } from "lucide-react";
import { PlayAloneButton } from "./play-alone-button";

export function PracticeAloneSection() {
  return (
    <section className="relative flex h-48 flex-col justify-between overflow-hidden rounded-lg border border-border p-6">
      <BookOpen
        strokeWidth={0.9}
        className="absolute -top-[6px] right-[30px] z-0 size-[150px] rotate-3 transform text-muted opacity-30"
      />

      <div className="z-10 flex flex-col">
        <h1 className="text-2xl font-bold">Practice</h1>
        <p className="text-muted-foreground">Practice in peace by yourself</p>
      </div>

      <PlayAloneButton />
    </section>
  );
}
