import HeroSection from "@/components/sections/sections/HeroSection";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Home() {
  const t = useTranslations();
  return (
    <div>
      <HeroSection />
    </div>
  );
}
