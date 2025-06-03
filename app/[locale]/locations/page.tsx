import BannerContainer from "@/components/BannerContainer";
import PageLayout from "@/components/layout/PageLayout";
import { getRequest } from "@/lib/apiServices";
import { ServiceItem } from "@/types/auth";
import { Metadata } from "next";
import Image from "next/image";
import React from "react";
import { FaBabyCarriage } from "react-icons/fa";
import { MdAirlineSeatReclineExtra, MdLuggage } from "react-icons/md";

export async function generateMetadata(): Promise<Metadata> {
    const pageData = await getRequest("content/page?slug=locations");

    return {
        title: pageData?.data?.seo_title || pageData?.data?.title,
        description: pageData?.data?.seo_description,
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
    const locationData = await getRequest("content/page?slug=locations");
    const locationLists = await getRequest("content/template?type=area");



    return <>

        <div className="">
            <BannerContainer
                title={locationData?.data?.title ?? "Fleet"}
                imageSrc={locationData?.data?.image_1_link}
                alt={locationData?.data?.altTag_1}
            />

            <PageLayout>
                {locationData?.data?.text_2 && (
                    <div className="mx-auto w-width_sm md:w-width_md lg:w-width_lg xl:w-width_xl 2xl:w-width_2xl flex my-[50px] flex-col gap-2">
                        <h3
                            className="text-center tracking-wide text-[#171616] font-light text-[30px] "
                            dangerouslySetInnerHTML={{ __html: locationData?.data?.text_2 }}
                        />
                    </div>
                )}


                <div className="my-20 flex flex-col gap-[50px]">
                    {
                        locationLists?.data?.map((item: ServiceItem, ind: number) => (
                            <div
                                key={ind}
                                className={`flex items-start flex-col md:flex-row ${ind % 2 !== 0 ? "md:flex-row-reverse" : ""
                                    } gap-6 items-center mb-12`}
                            >
                                <div className="relative w-full md:w-1/2 h-[150px] md:h-[300px] overflow-hidden rounded-[5px]">
                                    <Image
                                        src={item?.image_2_link || "/fallback.jpg"}
                                        alt={item?.altTag_2 || item?.title || "Image"}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>

                                <div className="w-[100%] md:w-[50%]">
                                    <div>
                                        <h2 className="text-titleColor font-bold tracking-wide text-[20px] ">
                                            {item?.title}
                                        </h2>

                                        <div
                                            className="text-left my-5 text-[#171616]  text-[18px] "
                                            dangerouslySetInnerHTML={{ __html: item?.text_1 }}
                                        />

                                        <div className="flex gap-3 justify-start">
                                            <p className="flex gap-1">
                                                <MdAirlineSeatReclineExtra
                                                    className="text-[#6AA571]"
                                                    size={20}
                                                />
                                                {item?.passenger ?? 1}
                                            </p>
                                            <p className="flex gap-1">
                                                <MdLuggage className="text-[#AA6F6F]" size={20} />
                                                {item?.luggage ?? 0}
                                            </p>
                                            <p className="flex gap-1">
                                                <FaBabyCarriage
                                                    className="text-[#AA6F6F]"
                                                    size={20}
                                                />
                                                {item?.baby_seat ?? 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </PageLayout>
        </div>
    </>;
};

export default page;
