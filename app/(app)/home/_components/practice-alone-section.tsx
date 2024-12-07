import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export function PracticeAloneSection() {
  return (
    <section className="h-48 relative overflow-hidden rounded-lg p-6 border flex flex-col justify-between border-border">
      <BookOpen strokeWidth={0.9} className="absolute size-[150px] -top-[6px] right-[30px] rotate-3 transform text-muted opacity-30 z-0" />
      <div className="flex z-10 flex-col">
        <h1 className="text-2xl font-bold">Practice</h1>
        <p className="text-muted-foreground">Practice in peace by yourself</p>
      </div>
      <Button className="w-full z-10 h-10 text-base">Practice</Button>
    </section>
  );
}
