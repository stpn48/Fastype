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
        <TooltipTrigger className="cursor-default" asChild>
          <div
            className={cn(
              "size-4 border-[1px] border-border bg-primary",
              color,
              activity !== 0 && "border-0",
            )}
          />
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
      return "bg-primary/0";
    case activity >= 20:
      return "bg-primary/100";
    case activity >= 10:
      return "bg-primary/80";
    case activity >= 5:
      return "bg-primary/60";
    case activity >= 1:
      return "bg-primary/40 ";
    default:
      return "bg-primary/0";
  }
}
