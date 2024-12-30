import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PlayAloneButton() {
  return (
    <Button className="z-10 flex h-10 w-full gap-2 text-base" asChild>
      <Link href="/race/practice">Practice</Link>
    </Button>
  );
}
