import { getTop10AllTimeWpmUsers } from "@/server/queries";
import { UserRow } from "./user-row";

type Props = {};

export async function AvgAllTimeWpmLeaderboard({}: Props) {
  const users = await getTop10AllTimeWpmUsers();

  if (!users) {
    return <div>no users found</div>;
  }

  return (
    <ol className="flex w-full max-w-[500px] flex-col gap-2 rounded-lg border border-border p-4">
      <h1 className="mb-4 w-full text-center text-base">Top 10 All Time Avarage Wpm</h1>
      {users.map((user, i) => (
        <UserRow
          key={user.id}
          rowNumber={i + 1}
          user={user}
          detail={user.stats?.avg_wpm_all_time.toString() || ""}
        />
      ))}
    </ol>
  );
}
