"use client";

import { completed_race } from "@prisma/client";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Props = {
  raceHistory: completed_race[];
};

export function ImprovementChart({ raceHistory }: Props) {
  const raceHistoryData = getRaceHistoryData(raceHistory);

  return (
    <div className="flex h-[350px] w-full flex-col items-center justify-center rounded-lg border border-border p-10">
      {raceHistoryData.length < 2 && (
        <p className="text-muted-foreground">not enough data to show chart</p>
      )}

      {raceHistoryData.length >= 2 && (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={raceHistoryData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis
              dataKey="raceNumber"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              label={{
                value: "race number",
                position: "bottom",
                offset: 10,
                style: { fill: "hsl(var(--muted-foreground))" },
              }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              label={{
                value: "wpm",
                position: "left",
                offset: -20,
                style: { fill: "hsl(var(--muted-foreground))" },
              }}
              width={60}
            />
            <Line
              type="monotone"
              dataKey="wpm"
              name="Words Per Minute"
              strokeWidth={2}
              stroke="hsl(var(--primary))"
              dot={false}
              activeDot={{
                r: 4,
                stroke: "hsl(var(--primary))",
                strokeWidth: 2,
                fill: "hsl(var(--background))",
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Race {payload[0].payload.raceNumber}
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {payload[0].value} WPM
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

function getRaceHistoryData(raceHistory: completed_race[]) {
  return raceHistory.map((race, raceIndex) => ({
    raceNumber: raceIndex + 1,
    wpm: race.wpm,
  }));
}
