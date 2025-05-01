"use client"

import { MdArrowOutward } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { NavigateLinks } from "../ui/Button";
import { HomeServiceSkeleton } from "../ui/Skeleton";

const ServiceCard = ({ imageUrl, title, desc, slug }) => {
    const t = useTranslations();

    return (
        <div className="space-y-3">
            <div className="w-full h-[150px] relative rounded-[5px] overflow-hidden">
                <Image
                    src={imageUrl || "/no-image.avif"}
                    alt={title}
                    fill
                    style={{ objectFit: imageUrl ? "cover" : "contain" }}
                    sizes="(max-width: 768px) 100vw, 300px"
                    priority={!!imageUrl}
                />
            </div>
            <div className="flex-grow h-max md:h-[194px] flex flex-col justify-between">
                <div>
                    <h3 className="font-semibold text-[22px] mt-[20px] text-titleColor ">{title}</h3>
                    <p
                        className="line-clamp-4 my-2 text-[15px] text-justify "
                        dangerouslySetInnerHTML={{ __html: desc }}
                    />
                </div>

                <div className="text-left">
                    <NavigateLinks
                        href={`/our-services/${slug}`}
                        aria-label="Explore more about us"
                    >
                        {t("show_more")} <MdArrowOutward size={20} />
                    </NavigateLinks>
                </div>
            </div>
        </div>
    );
};

const Service = ({ data: serviceListData }) => {
    const t = useTranslations();
    const queryClient = useQueryClient();
    // const serviceListData = queryClient.getQueryData(["services", i18n.language]);

    const isLoading = !serviceListData;

    return (
        <div className="bg-white w-full flex justify-center py-[20px] md:py-[70px]">
            <div className="">
                <h2 className="text-center text-[33px] pb-7 font-bold text-titleColor">
                    {t("our_services")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 relative mt-5 gap-[50px] justify-center items-start">
                    {isLoading
                        ? Array(3)
                            .fill(0)
                            .map((_, index) => <HomeServiceSkeleton key={index} />)
                        : serviceListData?.data?.length > 0 &&
                        serviceListData?.data
                            ?.slice(0, 3)
                            .map((item, ind) => (
                                <ServiceCard
                                    key={ind}
                                    imageUrl={item?.image_2_link}
                                    title={item?.title}
                                    desc={item?.text_1}
                                    slug={item?.slug}
                                />
                            ))}
                </div>
            </div>
        </div>
    );
};

export default Service;
