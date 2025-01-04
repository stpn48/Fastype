import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Props = {
  username: string | null;
  image_url: string;
  id: string;
};

export function UserAvatarProfileLink({ username, image_url, id }: Props) {
  return (
    <Link href={`/profile/${id}`}>
      <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80">
        <AvatarImage src={image_url} />
        <AvatarFallback>
          {username?.[0] || "U"}
          {username?.[1] || "N"}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
}
