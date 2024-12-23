import { getUser } from "@/server/queries";
import { CompletedRace } from "@prisma/client";
import { Week } from "./week";

export async function ActivityGraph() {
  const user = await getUser();

  if (!user) {
    return null;
  }

  const userActivity = getActivity(user.raceHistory);
  const weeksLast12Months = getWeeksLast12MonthsStartingMonday();

  return (
    <div className="flex w-full justify-center gap-1 rounded-lg border border-border p-10">
      {weeksLast12Months.map((week, weekIndex) => (
        <Week key={weekIndex} week={week} userActivity={userActivity} />
      ))}
    </div>
  );
}

function getActivity(raceHistory: CompletedRace[]) {
  const raceHistoryAsc = raceHistory.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  const activity: Record<string, number> = {};

  raceHistoryAsc.forEach((race) => {
    const raceDay = race.createdAt.toLocaleDateString();

    if (!activity[raceDay]) {
      activity[raceDay] = 1;
    } else {
      activity[raceDay] += 1;
    }
  });

  return activity;
}

function getWeeksLast12MonthsStartingMonday(): string[][] {
  const weeks = [];
  const today = new Date();

  // Find the most recent Monday
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Calculate how many days to subtract to get to Monday
  const startMonday = new Date(today);
  startMonday.setDate(today.getDate() - daysToSubtract);

  // Collect the past 12 months (52 weeks) starting from the most recent Monday
  for (let i = 0; i < 52; i++) {
    const week = [];
    const monday = new Date(startMonday);
    monday.setDate(startMonday.getDate() - i * 7); // Get the Monday of the current week

    // Add each day of the week (Monday to Sunday)
    for (let j = 0; j < 7; j++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + j); // Add 0 to 6 days to get the full week
      week.push(day.toLocaleDateString()); // Add the day as a string
    }

    weeks.push(week);
  }

  return weeks.reverse(); // Optional: Reverse the array to show from oldest to newest
}
