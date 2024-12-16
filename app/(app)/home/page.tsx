import { FindRaceSection } from "./_components/find-race-section/find-race-section";
import { PracticeAloneSection } from "./_components/play-alone-sectioin/practice-alone-section";
import { PlayWithFriendsSection } from "./_components/play-with-friends-section/play-with-friends-section";

export default function HomePage() {
  return (
    <div className="mt-20 flex h-full w-full flex-col items-center bg-background">
      <section className="grid w-full max-w-4xl gap-10">
        <FindRaceSection />

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          <PracticeAloneSection />
          <PlayWithFriendsSection />
        </div>
      </section>
    </div>
  );
}
