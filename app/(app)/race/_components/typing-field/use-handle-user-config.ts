import { getUser } from "@/app/actions/get-user";
import { updateUserConfig } from "@/app/actions/update-user-config";
import { useTypingFieldStore } from "@/hooks/zustand/use-typing-field";
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
    setIsLoadingUserConfig,
  } = useTypingFieldStore();

  // update user config when the user config changes
  useEffect(() => {
    if (fontFamily === null || !fontSize || smoothCaret === null) {
      return;
    }

    (async () => {
      await updateUserConfig({
        typing_field_font_size: fontSize,
        typing_field_font_family: fontFamily,
        typing_field_smooth_caret: smoothCaret,
      });
    })();
  }, [fontFamily, fontSize, smoothCaret]);

  // get user config on mount
  useEffect(() => {
    (async () => {
      setIsLoadingUserConfig(true);
      const user = await getUser();

      setIsLoading(false);

      if (!user) {
        toast.error("Error getting user");
        return;
      }

      console.log(user.user_config);

      setFontFamily(user.user_config!.typing_field_font_family);
      setFontSize(user.user_config!.typing_field_font_size);
      setSmoothCaret(user.user_config!.typing_field_smooth_caret);
      setIsLoadingUserConfig(false);
    })();
  }, []);
}
