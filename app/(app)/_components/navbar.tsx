import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <div className="h-[48px] fixed w-full flex items-center px-4 inset-0 backdrop-blur-sm bg-background/80 border-b border-border">
      <SignedIn>
        <SignOutButton />
      </SignedIn>

      <SignedOut>
        <SignInButton />
      </SignedOut>
    </div>
  );
}
