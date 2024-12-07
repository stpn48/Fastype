import { prisma } from "@/lib/prisma";
import { getUser } from "@/server/queries";
import { redirect } from "next/navigation";
import { RaceTrack } from "./_components/race-track";

export default async function RacePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();

  const paramsResolved = await params;

  if (!user || user.Race?.id !== paramsResolved.id) {
    redirect("/home");
  }

  return (
    <div className="flex justify-center items-center">
      <section className="grid grid-rows-2 grid-cols-1 max-w-4xl w-full gap-10">
        <RaceTrack raceId={paramsResolved.id} />
      </section>
    </div>
  );
}
