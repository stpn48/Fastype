import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Props = {
  activity: number;
  day: string;
};

export function Day({ activity, day }: Props) {
  const color = getActivityColor(activity);

  return (
    <TooltipProvider delayDuration={0.5}>
      <Tooltip>
        <TooltipTrigger className={cn("size-[3px] cursor-default sm:size-1 md:size-2 lg:size-4")}>
          <div className={cn("h-full w-full", color)} />
        </TooltipTrigger>
        <TooltipContent className="flex flex-col gap-2 text-center">
          <span>{activity} races</span>
          <span>{day}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function getActivityColor(activity: number) {
  switch (true) {
    case activity === 0:
      return "bg-secondary/30";
    case activity >= 20:
      return "bg-primary/100";
    case activity >= 10:
      return "bg-primary/80";
    case activity >= 5:
      return "bg-primary/60";
    case activity >= 1:
      return "bg-primary/40";
    default:
      return "bg-secondary";
  }
}
