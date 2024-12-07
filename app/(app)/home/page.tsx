import { FindRaceSection } from "./_components/find-race-section";
import { PlayWithFriendsSection } from "./_components/play-with-friends-section";
import { PracticeAloneSection } from "./_components/practice-alone-section";

export default function HomePage() {
  return (
    <div className="bg-background h-full w-full min-h-[75vh] flex flex-col items-center justify-center">
      <section className="grid gap-10 w-full max-w-4xl">
        <FindRaceSection />

        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2">
          <PracticeAloneSection />
          <PlayWithFriendsSection />
        </div>
      </section>
    </div>
  );
}
