import { useEffect, useState } from "react";

const themeColorsMap = {
  light: {
    background: "--background",
    foreground: "--foreground",
    primary: "--primary",
    secondary: "--secondary",
  },
  dark: {
    background: "--background",
    foreground: "--foreground",
    primary: "--primary",
    secondary: "--secondary",
  },
  "dark-forest": {
    background: "--background",
    foreground: "--foreground",
    primary: "--primary",
    secondary: "--secondary",
  },
};

export function useThemeColorsFor(theme: keyof typeof themeColorsMap) {
  const [colors, setColors] = useState({
    background: "",
    foreground: "",
    primary: "",
    secondary: "",
  });

  useEffect(() => {
    let isMounted = true; // Prevent state updates on unmounted components

    // Create a temporary element to fetch styles
    const tempDiv = document.createElement("div");
    tempDiv.className = theme; // Add the specific theme class
    tempDiv.style.position = "absolute";
    tempDiv.style.opacity = "0"; // Hide the element
    document.body.appendChild(tempDiv);

    // Fetch the colors for the given theme
    const rootStyles = getComputedStyle(tempDiv);
    const newColors = {
      background: rootStyles.getPropertyValue(themeColorsMap[theme].background).trim(),
      foreground: rootStyles.getPropertyValue(themeColorsMap[theme].foreground).trim(),
      primary: rootStyles.getPropertyValue(themeColorsMap[theme].primary).trim(),
      secondary: rootStyles.getPropertyValue(themeColorsMap[theme].secondary).trim(),
    };

    // Set the state only if the component is still mounted
    if (isMounted) {
      setColors(newColors);
    }

    // Cleanup
    document.body.removeChild(tempDiv);

    return () => {
      isMounted = false; // Prevent updating state after unmount
    };
  }, [theme]);

  return { colors };
}
