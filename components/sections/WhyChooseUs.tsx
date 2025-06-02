import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button, NavigateLinks } from "../ui/Button";
import { HomeWhyChooseSkeleton } from "../ui/Skeleton";
import Link from "next/link";
import { MdArrowOutward } from "react-icons/md";
import Image from "next/image";

interface WhyChooseUsProps {
  imageLink: string;
  content: string;
}

const WhyChooseUs = ({ imageLink, content }: WhyChooseUsProps) => {
  const t = useTranslations();

  const isLoading = !imageLink && !content;

  const updatedContent = useMemo(() => {
    return content?.replace(/classname/g, "class");
  }, [content]);

  if (isLoading) return <HomeWhyChooseSkeleton />;

  return (

    <div className="w-full bg-[#fff] flex justify-center pt-[50px] md:py-[70px]">
      <div className=" grid sm:grid-cols-1 md:grid-cols-2 gap-[20px]">
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
              className=" !h-[20px] !p-4 link !text-[14px] !font-medium !rounded-[5px] "
              aria-label="Explore more about us"
            >
              {t("explore_more")} <MdArrowOutward size={20} />
            </NavigateLinks>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full h-[350px] flex justify-end items-center">
          <div className="relative flex w-full md:w-[490px] h-full items-center max-md:py-[20px] rounded-[5px] overflow-hidden">
            <Image
              src={imageLink}
              alt="why to choose us"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-[8px]"
              sizes="(max-width: 768px) 100vw, 490px"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
