import { getRequest } from "@/lib/apiServices";
import { useTranslations } from "next-intl";
import Image from "next/image";
import page from "./about/page";
import HeroSection from "@/components/HeroSection";
import DownloadApp from "@/components/sections/DownloadApp";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Service from "@/components/sections/Service";
import PageLayout from "@/components/layout/PageLayout";
import FleetSection from "@/components/sections/FleetSection";


async function getData() {
  const [pageData, servicesData, siteInfo] = await Promise.all([
    getRequest("content/page?slug=home"),
    getRequest("content/template?type=service"),
    getRequest("content/site-info"),
  ]);


  return { pageData, servicesData, siteInfo };
}


export default async function Home() {
  const { pageData, servicesData, siteInfo } = await getData();




  return (
    <div>
      <HeroSection bannerImage={pageData?.data?.image_1_link} />
      <DownloadApp productInfo={siteInfo} />
      <PageLayout>
        <WhyChooseUs imageLink={pageData?.data?.image_2_link}
          content={pageData?.data?.text_2} />
        <Service data={servicesData} />
        {/* <FleetSection /> */}
      </PageLayout>


    </div>
  );
}
