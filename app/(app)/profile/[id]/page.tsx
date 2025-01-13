import { getUserDetails } from "@/server/queries";
import { Metadata } from "next";
import { ActivityGraph } from "./_components/activity-graph";
import { ImprovementChart } from "./_components/improvement-chart";
import { MainStats } from "./_components/main-stats";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "fastype - Profile",
  description: "View your stats and activity.",
};

export default async function ProfilePage({ params }: Props) {
  const { id: userId } = await params;

  const userDetails = await getUserDetails(userId);

  if (!userDetails || !userDetails.stats) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col gap-10 p-10">
      <MainStats userDetails={userDetails} />
      <ActivityGraph />
      <ImprovementChart raceHistory={userDetails.race_history} />
    </div>
  );
}
