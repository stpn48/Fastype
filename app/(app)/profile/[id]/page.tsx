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
    <div className="flex flex-1 flex-col gap-10 p-10">
      <MainStats userDetails={userDetails} />

      <ActivityGraph />
      <ImprovementChart raceHistory={userDetails.raceHistory} />
    </div>
  );
}
