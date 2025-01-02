"use client";

type Props = {
  name: string;
  value: number | string;
};

export function Statistic({ name, value }: Props) {
  return (
    <section className="flex w-fit flex-col items-center gap-1">
      <h1 className="text-2xl">{name}</h1>
      <p className="font-geist-mono text-7xl text-primary">{value}</p>
    </section>
  );
}
