import { getUser } from "@/app/actions/get-user";
import { updateUserConfig } from "@/app/actions/update-user-config";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
import { font_family } from "@prisma/client";
import { useEffect } from "react";
import { toast } from "sonner";

export function useHandleUserConfig() {
  const {
    fontFamily,
    fontSize,
    smoothCaret,
    setFontFamily,
    setFontSize,
    setSmoothCaret,
    setIsLoading,
  } = useTypingFieldStore();

  // update user config when the user config changes
  useEffect(() => {
    if (fontFamily === null || !fontSize || smoothCaret === null) {
      return;
    }

    (async () => {
      await updateUserConfig({
        typing_field_font_size: fontSize,
        typing_field_font_family: fontFamily as font_family,
        typing_field_smooth_caret: smoothCaret,
      });
    })();
  }, [fontFamily, fontSize, smoothCaret]);

  // get user config on mount
  useEffect(() => {
    (async () => {
      const user = await getUser();

      setIsLoading(false);

      if (!user) {
        toast.error("Error getting user");
        return;
      }

      setFontSize(user.user_config!.typing_field_font_size);
      setSmoothCaret(user.user_config!.typing_field_smooth_caret);
      setFontFamily(user.user_config!.typing_field_font_family);
    })();
  }, []);
}
