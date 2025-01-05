import { Metadata } from "next";
import { Suspense } from "react";
import { AllTimeBestWpmLeaderboard } from "./_components/all-time-best-wpm-leaderboard";
import { AvgAllTimeWpmLeaderboard } from "./_components/avg-all-time-wpm-leaderboard";
import Leaderboard from "./_components/leaderboard";

export const metadata: Metadata = {
  title: "fastype - Leaderboards",
  description: "View the leaderboards of fastype.",
};

export default async function LeaderboardsPage() {
  return (
    <div className="flex h-full w-full justify-center gap-10">
      <Suspense fallback={<Leaderboard.Skeleton />}>
        <AllTimeBestWpmLeaderboard />
      </Suspense>

      <Suspense fallback={<Leaderboard.Skeleton />}>
        <AvgAllTimeWpmLeaderboard />
      </Suspense>
    </div>
  );
}
