import BannerContainer from "@/components/BannerContainer";
import PageLayout from "@/components/layout/PageLayout";
import { getRequest } from "@/lib/apiServices";
import { Metadata } from "next";
import Image from "next/image";
import React from "react";

export async function generateMetadata(): Promise<Metadata> {
    const pageData = await getRequest("content/page?slug=drive-with-us");

    return {
        title: pageData?.data?.seo_title || pageData?.data?.title,
        description: pageData?.data?.seo_description || "Default description",
        openGraph: {
            title: pageData?.data?.seo_title || pageData?.data?.title,
            description: pageData?.data?.seo_description,

        },
        twitter: {
            card: "summary_large_image",
            title: pageData?.data?.seo_title || pageData?.data?.title,
            description: pageData?.data?.seo_description,
        },
    };
}

const page = async () => {
    const aboutData = await getRequest("content/page?slug=drive-with-us");


    return <>

        <div className="">
            <BannerContainer
                title={aboutData?.data?.title ?? "Drive With US"}
                imageSrc={aboutData?.data?.image_1_link}
                alt={aboutData?.data?.altTag_1}
            />

            <PageLayout>
                <div className="flex my-20 flex-col md:flex-row md:gap-[40px]">
                    <div className="w-full md:w-[40%] h-max">
                        <div className="relative h-[350px] w-full overflow-hidden rounded-[5px]">
                            <Image
                                src={aboutData?.data?.image_2_link || "/fallback.jpg"}
                                alt={aboutData?.data?.altTag_2 || "Drive With us"}
                                fill
                                style={{ objectFit: "cover" }}
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-[60%] max-md:p-3 m-0 text-justify flex flex-col gap-6">
                        <div className="flex gap-0 justify-between">
                            <div>
                                <div
                                    style={{
                                        wordSpacing: "2px",
                                    }}
                                    className="flex flex-col gap-[20px] text-justify  my-0 text-[#181a1f] font-normal text-[16px]"
                                    dangerouslySetInnerHTML={{
                                        __html: aboutData?.data?.text_2,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </PageLayout>
        </div>

    </>;
};

export default page;
