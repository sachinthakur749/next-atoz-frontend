import React from "react";
import googlePlayImg from "../../assets/image/Google_Play_Store_icon.png";
import AppStoreImg from "../../assets/image/App_Store_Icon.webp";

const DownloadApp = ({ title }) => {
    const { t } = useTranslation();
    const { productInfo } = useAuthContext();

    return (
        <div className="   md:mt-[0px] lg:mt-[0px] w-full flex flex-col items-center bg-black text-white">
            <div className="w-width_sm md:w-width_md lg:w-width_lg xl:w-width_xl 2xl:w-width_2xl px-[10px] py-[60px]">
                {title ? (
                    <>
                        <div className="" dangerouslySetInnerHTML={{ __html: title }} />
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
                    {productInfo?.passenger_android_link && (
                        <Link target="_blank" to={productInfo?.passenger_android_link}>
                            <img
                                src={googlePlayImg}
                                alt="google-play"
                                className="h-[40px] w-auto object-contain cursor-pointer"
                            />
                        </Link>
                    )}

                    {productInfo?.passenger_ios_link && (
                        <Link target="_blank" to={productInfo?.passenger_ios_link}>
                            <img
                                src={AppStoreImg}
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
