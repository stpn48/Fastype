"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

// TODO: Remove this component, this is just for now
export function ToggleThemeButton() {
  const [isMounted, setIsMounted] = useState(false);

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Button
      onClick={() => {
        setTheme(theme === "dark" ? "light" : "dark");
      }}
    >
      {theme === "dark" ? "🌙" : "🌞"}
    </Button>
  );
}
