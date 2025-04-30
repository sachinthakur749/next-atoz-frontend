import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button, NavigateLinks } from "../ui/Button";
import { HomeWhyChooseSkeleton } from "../ui/Skeleton";
import Link from "next/link";
import { MdArrowOutward } from "react-icons/md";

const WhyChooseUs = ({ imageLink, content }) => {
  const t = useTranslations();

  const isLoading = !imageLink && !content;

  const updatedContent = useMemo(() => {
    return content?.replace(/classname/g, "class");
  }, [content]);

  if (isLoading) return <HomeWhyChooseSkeleton />;

  return (

    <div className="w-full bg-[#fff] flex justify-center pt-[50px] md:py-[70px]">
      <div className="w-width_sm md:w-width_md lg:w-width_lg xl:w-width_xl 2xl:w-width_2xl grid sm:grid-cols-1 md:grid-cols-2 gap-[20px]">
        {/* Left section */}
        <div className="flex flex-col gap-10 max-md:p-[20px]">
          <div
            className="text-justify"
            dangerouslySetInnerHTML={{ __html: updatedContent }}
          />

          {/* Call to action */}
          <div className="flex items-center gap-10">
            <NavigateLinks
              href="/about-us"
              // onClick={() => router.push("/about-us")}
              className=" !h-[20px] !p-4 link !text-[14px] !font-medium !rounded-[5px] "
              aria-label="Explore more about us"
            >
              {t("explore_more")} <MdArrowOutward size={20} />
            </NavigateLinks>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full h-[350px] flex justify-end items-center">
          <div className="flex w-full md:w-[490px] h-[100%] items-center max-md:py-[20px]">
            {/* <LazyImage
              width="100%"
              height="100%"
              objectFit="cover"
              src={imageLink}
              alt="why to choose us"
              rounded="8px"
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
