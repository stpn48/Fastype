import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { stats, user } from "@prisma/client";

type Props = {
  userDetails: user & { stats: stats | null };
};

export function MainStats({ userDetails }: Props) {
  if (!userDetails.stats) {
    return null;
  }

  return (
    <div className="flex h-[300px] w-full items-center gap-4 rounded-lg border px-10">
      <section className="flex flex-col items-center justify-center gap-6 md:flex-row">
        <Avatar className="size-[100px]">
          <AvatarImage src={userDetails.image_url} />
          <AvatarFallback>
            {userDetails.username?.charAt(0).toUpperCase() ?? "U"}
            {userDetails.username?.charAt(0).toUpperCase() ?? "N"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center gap-1">
          <h2>{userDetails.username}</h2>
        </div>
      </section>

      <div className="gird-rows-2 grid flex-1 grid-cols-2 items-center gap-8 md:grid-cols-4 md:grid-rows-1">
        <section className="flex flex-col items-center gap-2">
          <h2 className="text-center font-bold text-muted-foreground">WPM</h2>
          <p className="text-4xl">{userDetails.stats.avg_wpm_all_time}</p>
        </section>
        <section className="flex flex-col items-center gap-2">
          <h2 className="text-center font-bold text-muted-foreground">LAST 10 RACES WPM</h2>
          <p className="text-4xl">{userDetails.stats.avg_wpm_last_10_races}</p>
        </section>
        <section className="flex flex-col items-center gap-2">
          <h2 className="text-center font-bold text-muted-foreground">BEST RACE WPM</h2>
          <p className="text-4xl">{userDetails.stats.best_race_wpm}</p>
        </section>
        <section className="flex flex-col items-center gap-2">
          <h2 className="text-center font-bold text-muted-foreground">LAST RACE WPM</h2>
          <p className="text-4xl">{userDetails.stats.last_race_wpm}</p>
        </section>
      </div>
    </div>
  );
}
