import { getRaceDetails, getUser } from "@/server/queries";
import { redirect } from "next/navigation";
import { RaceTrack } from "./_components/race-track/race-track";
import { TypingField } from "./_components/typing-field/typing-field";

// resolvedParams.id = raceId
export default async function RacePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();

  const paramsResolved = await params;

  if (!user || user.Race?.id !== paramsResolved.id) {
    redirect("/home");
  }

  const raceDetails = await getRaceDetails(paramsResolved.id);

  if (!raceDetails) {
    return null;
  }

  return (
    <div className="flex items-center justify-center">
      <section className="flex w-full max-w-4xl grid-cols-1 grid-rows-2 flex-col gap-10">
        <RaceTrack initialRaceUsers={raceDetails.users} raceId={paramsResolved.id} />
        <TypingField text={raceDetails.text} />
      </section>
    </div>
  );
}
