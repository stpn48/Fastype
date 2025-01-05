import { getTop10AllTimeWpmUsers } from "@/server/queries";
import Leaderboard from "./leaderboard";
import { UserRow } from "./user-row";

export async function AvgAllTimeWpmLeaderboard() {
  const users = await getTop10AllTimeWpmUsers();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <Leaderboard>
      <Leaderboard.Header
        title="Top 10 Highest Avarage WPM"
        infoText="Top 10 Users with the highest avarage WPM across all their races (have to have at least 500 races)"
      />

      {!users && <div className="flex w-full justify-center text-muted">no users found...</div>}

      {users?.map((user, i) => (
        <UserRow
          key={user.id}
          user={user}
          detail={user.stats!.avg_wpm_all_time.toString() + " wpm"}
          rowNumber={i + 1}
        />
      ))}
    </Leaderboard>
  );
}
