
import BannerContainer from "@/components/BannerContainer";
import PageLayout from "@/components/layout/PageLayout";
import { getRequest } from "@/lib/apiServices";

export async function generateMetadata() {

    const data = await getRequest("content/page?slug=terms-of-services");

    return {
        title: data?.data?.seo_title || "Terms of service",
        description: data?.data?.seo_description || "Best ride booking platform"
    }
}

const TermsOfServices = async () => {

    const termsData = await getRequest("content/page?slug=terms-of-services");

    return (
        <>

            <div className=" relative fleet-banner md:bg-slate-400 w-full h-[10vh] md:h-[50vh]  ">
                <BannerContainer
                    title={termsData?.data?.title}
                    imageSrc={"/images/terms-of-service.jpg"}
                />
            </div>
            <PageLayout>
                {termsData && (
                    <div
                        className="flex flex-col gap-[20px] text-justify tracking-wide my-5 text-[#181a1f] font-normal text-[16px]"
                        dangerouslySetInnerHTML={{ __html: termsData?.data?.text_2 }}
                    />
                )}
            </PageLayout>
        </>
    );
};

export default TermsOfServices;
