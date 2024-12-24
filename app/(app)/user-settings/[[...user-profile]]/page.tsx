import { UserProfile } from "@clerk/nextjs";

export default function UserProfilePage() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <UserProfile />
    </div>
  );
}
