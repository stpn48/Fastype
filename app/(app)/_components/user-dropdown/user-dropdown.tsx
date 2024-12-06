import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { SignoutItem } from "./signout-item";

export async function UserDropdown() {
  const { userId } = await auth();

  const clerk = await clerkClient();

  const user = await clerk.users.getUser(userId!);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="size-8">
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback>
            {user?.firstName?.charAt(0) ?? "U"}
            {user?.lastName?.charAt(0) ?? "N"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem> {/* TODO: Add profile page */}
        <SignoutItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
