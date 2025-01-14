import { Metadata } from "next";
import { Suspense } from "react";
import { ToolbarProvider } from "./hooks/use-toolbar";
import PracticeRacePageCore from "./practice-page-core";

export const metadata: Metadata = {
  title: "fastype - Practice",
  description: "Practice typing with fastype.",
};

export default function PracticeRacePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToolbarProvider>
        <PracticeRacePageCore />
      </ToolbarProvider>
    </Suspense>
  );
}
