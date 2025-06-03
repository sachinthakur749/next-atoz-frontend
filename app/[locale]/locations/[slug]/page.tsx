import BannerContainer from "@/components/BannerContainer";
import PageLayout from "@/components/layout/PageLayout";
import { getRequest } from "@/lib/apiServices";
import Image from "next/image";


interface SingleLocationPageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata(
    { params }: SingleLocationPageProps,
) {
    const { slug } = await params;
    const pageData = await getRequest(`content/page?slug=${slug}`);
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


const SingleLocationPage = async ({ params }: SingleLocationPageProps) => {
    const { slug } = await params;
    const singleLocationData = await getRequest(
        `content/page?slug=${slug}`
    );


    return (
        <>
            <div >
                <BannerContainer
                    title={singleLocationData?.data?.title}
                    imageSrc={singleLocationData?.data?.image_1_link}
                    alt={singleLocationData?.data?.altTag_1 || "Fleet Banner Image"}
                />
            </div>
            <PageLayout>
                <div className="my-10 h-auto  ">
                    <h2 className=" text-[#0c0b31] hidden  md:block font-bold tracking-wide text-[30px] my-4 ">
                        {singleLocationData?.data?.title}
                    </h2>
                    <div className=" flex flex-col md:flex-row  gap-[40px] ">
                        <div className="relative w-[100%] md:w-[50%] h-[250px]">
                            {singleLocationData?.data?.image_2_link && (
                                <Image
                                    fill
                                    objectFit="cover"
                                    src={singleLocationData?.data?.image_2_link || ""}
                                    alt="images of our services"
                                    className="rounded-[10px]"
                                />
                            )}
                        </div>

                        <div className="w-[100%] md:w-[70%] text-justify   ">
                            <div className="">
                                <div
                                    className="flex flex-col gap-[20px] text-justify tracking-wide  text-[#181a1f] font-normal text-[16px]"
                                    dangerouslySetInnerHTML={{
                                        __html: singleLocationData?.data?.text_1,
                                    }}
                                />
                                <div
                                    className="flex flex-col gap-[20px] text-justify tracking-wide  text-[#181a1f] font-normal text-[16px]"
                                    dangerouslySetInnerHTML={{
                                        __html: singleLocationData?.data?.text_2,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </PageLayout>

        </>
    );
};

export default SingleLocationPage;
