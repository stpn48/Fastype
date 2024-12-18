import { getUserDetails } from "@/server/queries";
import { ActivityGraph } from "./_components/activity-graph";
import { MainStats } from "./_components/main-stats";

export default async function ProfilePage(params: Promise<{ params: { id: string } }>) {
  const paramsAwaited = await params;

  const userDetails = await getUserDetails(paramsAwaited.params.id);

  if (!userDetails || !userDetails.stats) {
    return null;
  }

  return (
    <div className="flex flex-1 p-10">
      <section className="flex w-full flex-col items-center gap-10">
        <MainStats userDetails={userDetails} />

        <ActivityGraph />
      </section>
    </div>
  );
}
