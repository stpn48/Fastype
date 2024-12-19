import { getUserDetails } from "@/server/queries";
import { ActivityGraph } from "./_components/activity-graph";
import { ImprovementChart } from "./_components/improvement-chart";
import { MainStats } from "./_components/main-stats";

export default async function ProfilePage(params: Promise<{ params: { id: string } }>) {
  const paramsAwaited = await params;

  const userDetails = await getUserDetails(paramsAwaited.params.id);

  if (!userDetails || !userDetails.stats) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col gap-[100px] p-10">
      <section className="flex w-full flex-col items-center gap-10">
        <MainStats userDetails={userDetails} />

        <ActivityGraph />
      </section>

      <section className="flex w-full flex-col items-center gap-10">
        <h3 className="w-full text-center text-2xl font-bold">Improvement Chart</h3>
        <ImprovementChart raceHistory={userDetails.raceHistory} />
      </section>
    </div>
  );
}
