import { getRaceDetails } from "@/server/queries";
import { UserTrack } from "./user-track";

type Props = { raceId: string };

export async function RaceTrack({ raceId }: Props) {
  const raceDetails = await getRaceDetails(raceId);

  if (!raceDetails) {
    return null;
  }

  return (
    <div className="flex w-full flex-col rounded-lg border border-border">
      {raceDetails.users.map(async (user) => (
        <UserTrack userId={user.id} userClerkId={user.clerkId} />
      ))}
    </div>
  );
}
