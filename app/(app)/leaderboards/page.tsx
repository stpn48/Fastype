import { Metadata } from "next";
import { AvgAllTimeWpmLeaderboard } from "./_components/avg-all-time-wpm-leaderboard";

type Props = {};

export const metadata: Metadata = {
  title: "fastype - Leaderboards",
  description: "View the leaderboards of fastype.",
};

export default async function LeaderboardsPage({}: Props) {
  return (
    <div>
      <AvgAllTimeWpmLeaderboard />
    </div>
  );
}
