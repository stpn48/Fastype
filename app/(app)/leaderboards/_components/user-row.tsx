import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
      <div
        className={cn(
          "flex cursor-pointer items-center gap-4 rounded-lg border border-transparent p-2 px-4 hover:border-border",
          rowNumber % 2 !== 0 ? "bg-secondary/20" : "",
        )}
      >
        <span>{rowNumber}</span>
        <Avatar>
          <AvatarImage src={user.image_url} alt={user.username || ""} />
          <AvatarFallback>
            {user.username?.charAt(0).toUpperCase()}
            {user.username?.charAt(1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span>{user.username}</span>
        <div className="flex-1" />
        <span>{detail}</span>
      </div>
    </Link>
  );
}
