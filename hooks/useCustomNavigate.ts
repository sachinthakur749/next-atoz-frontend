"use client";

import { usePathname, useRouter } from "@/i18n/navigation";

const useCustomNavigate = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navigateToPath = (path: string, openInNewTab = false) => {
    const isIframe = pathname.includes("iframe");
    const newPath = isIframe ? `/iframe${path}` : path;

    if (openInNewTab && isIframe) {
      window.open(newPath, "_blank");
    } else {
      router.push(newPath);
    }
  };

  return navigateToPath;
};

export default useCustomNavigate;
