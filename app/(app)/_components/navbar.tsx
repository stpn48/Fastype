import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { UserDropdown } from "./user-dropdown/user-dropdown";

export async function Navbar() {
  return (
    <div className="h-[56px] fixed w-full flex items-center px-4 inset-0 backdrop-blur-sm bg-background/80 border-b border-border">
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
