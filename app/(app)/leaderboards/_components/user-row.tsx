import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserAvatarProfileLink } from "@/components/user-avatar-profile-link";
import { cn } from "@/lib/utils";
import { stats } from "@prisma/client";
import Link from "next/link";

type Props = {
  user: {
    id: string;
    username: string | null;
    image_url: string;
    stats: stats | null;
  };
  rowNumber: number;
  detail: string;
};

export async function UserRow({ rowNumber, detail, user }: Props) {
  return (
    <Link href={`/profile/${user.id}`}>
      <li
        className={cn(
          "flex cursor-pointer items-center gap-4 rounded-lg border border-transparent p-2 px-4 hover:border-border",
          rowNumber % 2 !== 0 ? "bg-secondary/20" : "",
        )}
      >
        <span>{rowNumber}</span>
        <UserAvatarProfileLink id={user.id} image_url={user.image_url} username={user.username} />
        <span>{user.username}</span>
      </li>
    </Link>
  );
}
