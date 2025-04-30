import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const DownloadApp = ({ productInfo }) => {

    console.log("777", productInfo)

    const t = useTranslations();


    return (
        <div className="w-full flex flex-col px bg-black text-white">
            <div className="w-width_sm md:w-width_md lg:w-width_lg xl:w-width_xl 2xl:w-width_2xl px-[10px] py-[60px]">
                {productInfo?.data?.text_download_app ? (
                    <>
                        <div className="" dangerouslySetInnerHTML={{ __html: productInfo?.data?.text_download_app }} />
                    </>
                ) : (
                    <>
                        <h2 className="text-[28px] leading-[1.2] font-semibold text-center md:text-start">
                            {t("chauffeur_services_on_demand")}
                        </h2>

                        <p className="text-center md:text-start">
                            {t(
                                "get_our_app_for_quick_and_secure_ride_bookings_anytime_anywhere"
                            )}
                        </p>
                    </>
                )}

                <div className="mt-[40px] flex items-center justify-center md:justify-start gap-[30px] ">
                    {productInfo?.data?.passenger_android_link && (
                        <Link target="_blank" href={productInfo?.data?.passenger_android_link}>
                            <img
                                src="/images/google_play.png"
                                alt="google-play"
                                className="h-[40px] w-auto object-contain cursor-pointer"
                            />
                        </Link>
                    )}

                    {productInfo?.data?.passenger_ios_link && (
                        <Link target="_blank" href={productInfo?.data?.passenger_ios_link}>
                            <img
                                src="/images/app_store.webp"
                                alt="app-store"
                                className="h-[40px] w-auto object-contain cursor-pointer "
                            />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DownloadApp;
