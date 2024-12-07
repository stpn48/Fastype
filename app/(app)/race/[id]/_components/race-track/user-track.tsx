import { clerkClient } from "@clerk/nextjs/server";
import { AvatarProgress } from "./avatar-progress";

type Props = {
  userClerkId: string;
};

export async function UserTrack({ userClerkId }: Props) {
  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userClerkId);

  if (!clerkUser) {
    return null;
  }

  return (
    <div className="relative flex h-[50px] w-full items-center border-y border-border first:border-t-0 last:border-b-0">
      <AvatarProgress
        firstName={clerkUser.firstName || "U"}
        lastName={clerkUser.lastName || "N"}
        imageUrl={clerkUser.imageUrl}
      />
    </div>
  );
}
