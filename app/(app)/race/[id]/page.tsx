import { getRaceDetails, getUser } from "@/server/queries";
import { redirect } from "next/navigation";
import { Countdown } from "./_components/countdown";
import { DisconnectUserHandler } from "./_components/disconnect-user-handler";
import { PrivateRaceOptions } from "./_components/private-race-options";
import { RaceTrack } from "./_components/race-track/race-track";
import { TypingField } from "./_components/typing-field/typing-field";

// resolvedParams.id = raceId
export default async function RacePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();

  const paramsResolved = await params;

  const raceDetails = await getRaceDetails(paramsResolved.id);

  if (!raceDetails) {
    console.error("Race not found");
    redirect("/home");
  }

  // USER IS NOT AUTHENTICATED AND RACE TYPE IS NOT PRIVATE GO HOME
  if (!user || (user.raceId !== paramsResolved.id && raceDetails.type !== "private")) {
    console.error("User not authenticated");
    redirect("/home");
  }

  return (
    <div className="relative flex items-center justify-center">
      <section className="flex w-full max-w-4xl grid-cols-1 grid-rows-2 flex-col gap-10">
        <RaceTrack raceDetails={raceDetails} userId={user.id} />
        <TypingField text={raceDetails.text} userId={user.id} raceId={paramsResolved.id} />
        <Countdown raceType={raceDetails.type} raceId={raceDetails.id} />

        {raceDetails.type === "private" && <PrivateRaceOptions raceId={raceDetails.id} />}
      </section>

      <DisconnectUserHandler userId={user.id} raceId={raceDetails.id} />
    </div>
  );
}
