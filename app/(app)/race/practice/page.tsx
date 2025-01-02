import { Metadata } from "next";
import { ToolbarProvider } from "./hooks/use-toolbar";
import PracticeRacePageCore from "./practice-page-core";

export const metadata: Metadata = {
  title: "fastype - Practice",
  description: "Practice typing with fastype.",
};

export default function PracticeRacePage() {
  return (
    <ToolbarProvider>
      <PracticeRacePageCore />
    </ToolbarProvider>
  );
}
