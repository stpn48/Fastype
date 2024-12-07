import { getUser } from "@/server/queries";
import { redirect } from "next/navigation";
import { RaceTrack } from "./_components/race-track/race-track";

export default async function RacePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();

  const paramsResolved = await params;

  if (!user || user.Race?.id !== paramsResolved.id) {
    redirect("/home");
  }

  return (
    <div className="flex items-center justify-center">
      <section className="grid w-full max-w-4xl grid-cols-1 grid-rows-2 gap-10">
        <RaceTrack raceId={paramsResolved.id} />
      </section>
    </div>
  );
}
