import { getRequest } from "@/lib/apiServices";
import BannerContainer from "@/components/BannerContainer";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const pageData = await getRequest("content/page?slug=privacy-policy");

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

const PrivacyPolicy = async () => {
    const privacyData = await getRequest("content/page?slug=privacy-policy");

    return (
        <>

            <div className=" relative fleet-banner md:bg-slate-400 w-full h-[10vh] md:h-[50vh]  ">
                <BannerContainer
                    title={privacyData?.data?.title}
                    imageSrc={"/images/privacy-policy.jpg"}
                    alt="terms-of-services"
                />
            </div>

            <div className="mx-auto my-4 h-auto py-2 w-width_sm md:w-width_md lg:w-width_lg xl:w-width_xl 2xl:w-width_2xl max-w-[1200px]">
                <div className="mx-auto w-width_sm md:w-width_md lg:w-width_lg xl:w-width_xl 2xl:w-width_2xl flex my-[50px] flex-col gap-2">

                    <>
                        {privacyData && (
                            <div
                                className="flex flex-col gap-[20px] text-justify  my-5 text-[#181a1f] font-normal text-[16px]"
                                dangerouslySetInnerHTML={{ __html: privacyData.data.text_2 }}
                            />
                        )}
                    </>

                </div>
            </div>
        </>
    );
};

export default PrivacyPolicy;
