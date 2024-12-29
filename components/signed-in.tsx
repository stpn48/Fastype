import { getUser } from "@/server/queries";
import { PropsWithChildren } from "react";

export async function SignedIn({ children }: PropsWithChildren) {
  const user = await getUser();

  if (!user) return null;

  return <>{children}</>;
}
