import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PlayAloneButton() {
  return (
    <Link href="/race/practice">
      <Button className="z-10 flex h-10 w-full gap-2 text-base">Practice</Button>
    </Link>
  );
}
