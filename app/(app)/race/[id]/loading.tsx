import React from "react";

export default function LoadingRacePage() {
  return (
    <div className="flex items-center justify-center">
      <section className="flex w-[896px] grid-cols-1 grid-rows-2 flex-col gap-10">
        <div className="h-[150px] w-full animate-pulse rounded-lg bg-secondary" />
        <div className="h-[200px] w-full animate-pulse rounded-lg bg-secondary" />
      </section>
    </div>
  );
}
