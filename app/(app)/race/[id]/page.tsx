import { getRaceDetails, getUser } from "@/server/queries";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Countdown } from "./_components/countdown";
import { DisconnectUserHandler } from "./_components/disconnect-user-handler";
import { PrivateRaceOptions } from "./_components/private-race-options";
import { RaceTrack } from "./_components/race-track/race-track";
import { RaceUpdatesListener } from "./_components/race-updates-listener";
import { TypingField } from "./_components/typing-field/typing-field";

export const metadata: Metadata = {
  title: "FastType - Race",
  description: "Racing !",
};

export default async function RacePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();

  if (!user) {
    redirect("/home");
  }

  const { id: raceId } = await params;

  const raceDetails = await getRaceDetails(raceId);

  if (!raceDetails) {
    redirect("/home");
  }

  // if the current user is not part of this race when the race is not private, redirect to home (private races can be joined by anyone)
  if (user.race_id !== raceId && raceDetails.type !== "private") {
    redirect("/home");
  }

  return (
    <div className="relative flex items-center justify-center">
      <section className="flex w-full max-w-4xl grid-cols-1 grid-rows-2 flex-col gap-10">
        <RaceTrack userId={user.id} raceDetails={raceDetails} />

        <TypingField
          text={raceDetails.text}
          userId={user.id}
          raceId={raceId}
          raceType={raceDetails.type}
        />

        {raceDetails.type === "private" && <PrivateRaceOptions raceId={raceDetails.id} />}

        <Countdown raceType={raceDetails.type} raceId={raceId} />
      </section>

      <RaceUpdatesListener raceId={raceId} />
      <DisconnectUserHandler userId={user.id} raceId={raceDetails.id} />
    </div>
  );
}
