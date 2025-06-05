"use client";

import { usePathname } from "@/i18n/navigation";
import { useEffect } from "react";

function ScrollToTop() {
    const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
