import { getUser } from "@/app/actions/get-user";
import { user_config } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useUserConfig() {
  const [userConfig, setUserConfig] = useState<user_config | null>(null);

  // get user config on mount
  useEffect(() => {
    (async () => {
      const user = await getUser();

      if (!user) {
        toast.error("Error getting user");
        return;
      }

      setUserConfig(user.user_config);
    })();
  }, []);

  return { userConfig };
}
