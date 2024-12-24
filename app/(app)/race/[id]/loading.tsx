import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingRacePage() {
  return (
    <div className="flex items-center justify-center">
      <section className="flex w-[896px] grid-cols-1 grid-rows-2 flex-col gap-10">
        <Skeleton className="h-[150px] w-full rounded-lg" />
        <Skeleton className="h-[200px] w-full rounded-lg" />
      </section>
    </div>
  );
}
