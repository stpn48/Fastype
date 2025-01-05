import { getTop10AllTimeBestWpmUsers } from "@/server/queries";
import Leaderboard from "./leaderboard";
import { UserRow } from "./user-row";

type Props = {};

export async function AllTimeBestWpmLeaderboard({}: Props) {
  const users = await getTop10AllTimeBestWpmUsers();

  return (
    <Leaderboard>
      <Leaderboard.Header
        title="Top 10 Fastest"
        infoText="Top 10 fastest users of all time. Fastest WPM in one race"
      />

      {!users && <div className="flex w-full justify-center text-muted">no users found...</div>}

      {users?.map((user, i) => (
        <UserRow
          user={user}
          key={user.id}
          detail={user.stats!.best_race_wpm.toString() + " wpm"}
          rowNumber={i + 1}
        />
      ))}
    </Leaderboard>
  );
}
