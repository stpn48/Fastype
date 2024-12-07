import { prisma } from "@/lib/prisma";
import { UserTrack } from "./user-track";

type Props = { raceId: string };

export async function RaceTrack({ raceId }: Props) {
  // TODO: Move this to queries
  const raceDetails = await prisma.race.findUnique({
    where: {
      id: raceId,
    },
    include: {
      users: true,
    },
  });

  if (!raceDetails) {
    return null;
  }

  return (
    <div className="border flex flex-col border-border w-full rounded-lg">
      {raceDetails?.users.map(async (user) => (
        <UserTrack userClerkId={user.clerkId} />
      ))}
    </div>
  );
}
