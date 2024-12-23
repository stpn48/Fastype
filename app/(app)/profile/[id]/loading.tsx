import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingProfilePage() {
  return (
    <div className="flex flex-1 flex-col gap-10 p-10">
      <Skeleton className="h-[200px] w-full rounded-lg" />
      <Skeleton className="h-[200px] w-full rounded-lg" />
      <Skeleton className="h-[200px] w-full rounded-lg" />
    </div>
  );
}
