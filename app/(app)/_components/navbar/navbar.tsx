import { SignedIn } from "@/components/signed-in";
import { SignedOut } from "@/components/signed-out";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SearchUsersDialog } from "./search-users-dialog";
import { UserDropdown } from "./user-dropdown/user-dropdown";

export async function Navbar() {
  return (
    <div className="fixed inset-0 z-50 flex h-[56px] w-full items-center border-b border-border bg-background/80 px-4 backdrop-blur-sm">
      <Link href={"/home"}>
        <h1 className="text-xs font-bold">FASTYPE</h1>
      </Link>
      <div className="flex-1" />

      <SignedIn>
        <div className="flex items-center gap-4">
          <SearchUsersDialog />

          <UserDropdown />
        </div>
      </SignedIn>

      <SignedOut>
        <Button asChild>
          <Link href={"/sign-in"}>Sign in</Link>
        </Button>
      </SignedOut>
    </div>
  );
}
