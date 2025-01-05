import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { ReactNode } from "react";

type LeaderboardType = React.FC<{ children?: ReactNode }> & {
  Header: React.FC<HeaderProps>;
  Skeleton: React.FC;
};

const Leaderboard: LeaderboardType = ({ children }) => {
  return (
    <ol className="flex w-full max-w-[500px] flex-col gap-2 rounded-lg border border-border p-4">
      {children}
    </ol>
  );
};

type HeaderProps = {
  title: string;
  infoText: string;
};

const Header: React.FC<HeaderProps> = ({ title, infoText }) => {
  return (
    <div className="mb-4 flex items-center justify-center">
      <h1 className="w-full text-center text-base">{title}</h1>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info className="size-4 text-foreground/50" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{infoText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

const Skeleton: React.FC = () => {
  return (
    <ol className="flex h-[500px] w-full max-w-[500px] animate-pulse flex-col gap-2 rounded-lg border border-border bg-secondary p-4"></ol>
  );
};

Leaderboard.Header = Header;
Leaderboard.Skeleton = Skeleton;

export default Leaderboard;
