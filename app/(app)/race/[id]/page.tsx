import { prisma } from "@/lib/prisma";
import { getUser } from "@/server/queries";
import { redirect } from "next/navigation";

export default async function RacePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();

  const paramsResolved = await params;

  if (!user || user.Race?.id !== paramsResolved.id) {
    redirect("/home");
  }

  const raceDetails = await prisma.race.findUnique({
    where: {
      id: paramsResolved.id,
    },
    include: {
      users: true,
    },
  });

  return (
    <div>
      {raceDetails?.users.map((user) => (
        <p key={user.id}>{user.id}</p>
      ))}
    </div>
  );
}
