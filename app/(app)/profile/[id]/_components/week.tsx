import { Day } from "./day";

type Props = {
  userActivity: Record<string, number>;
  week: string[];
};

export function Week({ week, userActivity }: Props) {
  return (
    <div className="grid grid-cols-1 grid-rows-7 gap-1">
      {week.map((day) => (
        <Day key={day} activity={userActivity[day] ?? 0} day={day} />
      ))}
    </div>
  );
}
