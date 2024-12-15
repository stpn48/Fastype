"use client";

import { ThemeProvider } from "next-themes";

export function NextThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      themes={["light", "dark", "dark-forest", "rose"]}
      enableSystem
    >
      {children}
    </ThemeProvider>
  );
}
