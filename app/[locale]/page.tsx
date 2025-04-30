import { getRequest } from "@/lib/apiServices";
import { useTranslations } from "next-intl";
import Image from "next/image";
import page from "./about/page";
import HeroSection from "@/components/HeroSection";


async function getData() {
  const [pageData, servicesData, siteInfo] = await Promise.all([
    getRequest("content/page?slug=home"),
    getRequest("content/template?type=service"),
    getRequest("content/site-info"),
  ]);

  console.log(pageData, "pageData");

  return { pageData, servicesData, siteInfo };
}


export default async function Home() {
  const { pageData, servicesData, siteInfo } = await getData();

  console.log(pageData)



  return (
    <div>
      <HeroSection bannerImage={pageData?.data?.image_1_link} />


    </div>
  );
}
