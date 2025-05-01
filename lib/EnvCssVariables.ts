"use client";

import { useEffect } from "react";

export function EnvCssVariables() {
  useEffect(() => {
    // Get the value from environment variable
    const primaryColor = process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#ec6408";

    // Set it as a CSS variable
    document.documentElement.style.setProperty("--color-primary", primaryColor);
  }, []);

  return null;
}
