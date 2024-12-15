import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { UserDropdown } from "./user-dropdown/user-dropdown";

export async function Navbar() {
  return (
    <div className="fixed inset-0 z-50 flex h-[56px] w-full items-center border-b border-border bg-background/80 px-4 backdrop-blur-sm">
      <div className="flex-1" />

      <SignedOut>
        <Button>
          <SignInButton />
        </Button>
      </SignedOut>
      <SignedIn>
        <UserDropdown />
      </SignedIn>
    </div>
  );
}
