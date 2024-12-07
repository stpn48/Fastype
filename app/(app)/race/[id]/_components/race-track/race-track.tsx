import { User } from "@prisma/client";
import { UserTrack } from "./user-track";

type Props = { users: User[] };

export function RaceTrack({ users }: Props) {
  return (
    <div className="flex w-full flex-col rounded-lg border border-border">
      {users.map(async (user) => (
        <UserTrack userClerkId={user.clerkId} />
      ))}
    </div>
  );
}
