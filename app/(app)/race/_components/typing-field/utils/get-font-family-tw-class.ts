import { font_family } from "@prisma/client";

export function getFontFamilyTwClass(fontFamily: font_family) {
  if (fontFamily === "geist_mono") {
    return "font-geist-mono";
  }

  if (fontFamily === "geist_sans") {
    return "font-geist-sans";
  }
}
