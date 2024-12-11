import { AvatarProgress } from "./avatar-progress";
import { RaceUser } from "./race-track";

type Props = {
  raceUser: RaceUser;
};

export function UserTrack({ raceUser }: Props) {
  return (
    <div className="relative flex h-[50px] w-full items-center border-b border-border last:border-b-0">
      <AvatarProgress
        firstName={raceUser.firstName ?? "U"}
        lastName={raceUser.lastName ?? "N"}
        imageUrl={raceUser.imageUrl ?? ""}
        clerkId={raceUser.clerkId}
      />
    </div>
  );
}
