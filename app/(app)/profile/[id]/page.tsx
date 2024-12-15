import { getUserDetails } from "@/server/queries";

export default async function ProfilePage(params: Promise<{ params: { id: string } }>) {
  const paramsAwaited = await params;

  const userDetails = await getUserDetails(paramsAwaited.params.id);

  return (
    <div className="flex-1 p-10">
      <div className="flex h-[300px] w-full items-center gap-4 rounded-lg border px-10">
        <section className="flex flex-col items-center justify-center gap-6 md:flex-row">
          <img
            className="size-[100px] rounded-full"
            src={userDetails?.imageUrl || ""}
            alt="user-image"
          />
          <div className="flex flex-col items-center gap-1">
            <h2>{userDetails?.firstName}</h2>
          </div>
        </section>
        <div className="gird-rows-2 grid flex-1 grid-cols-2 items-center md:grid-cols-4 md:grid-rows-1">
          <section className="flex flex-col items-center gap-2">
            <h2 className="text-center font-bold text-muted-foreground">WPM</h2>
            <p className="text-4xl">{userDetails?.stats.avgWpmAllTime}</p>
          </section>
          <section className="flex flex-col items-center gap-2">
            <h2 className="text-center font-bold text-muted-foreground">LAST 10 RACES WPM</h2>
            <p className="text-4xl">{userDetails?.stats.avgWpmLast10Races}</p>
          </section>
          <section className="flex flex-col items-center gap-2">
            <h2 className="text-center font-bold text-muted-foreground">BEST RACE WPM</h2>
            <p className="text-4xl">{userDetails?.stats.bestRaceWpm}</p>
          </section>
          <section className="flex flex-col items-center gap-2">
            <h2 className="text-center font-bold text-muted-foreground">LAST RACE WPM</h2>
            <p className="text-4xl">{userDetails?.stats.lastRaceWpm}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
