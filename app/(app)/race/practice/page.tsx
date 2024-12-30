import { getUser } from "@/server/queries";
import { redirect } from "next/navigation";
import { PracticeRaceCore } from "./practice-race-core";

type Props = {};

export default async function PracticeRacePage({}: Props) {
  const user = await getUser();

  if (!user) {
    redirect("/home");
  }

  return <PracticeRaceCore />;
}
