import Image from "next/image";
import React from "react";

const BannerContainer = ({ title, imageSrc }) => {
    return (
        <div className="relative fleet-banner md:bg-slate-400 w-full h-[15vh] md:h-[50vh]">
            <div className="w-full h-full absolute hidden md:block top-0 left-0 right-0 bottom-0">
                <div className="relative w-full h-full">
                    <Image
                        fill
                        src={imageSrc}
                        alt="images"
                        sizes="100vw"
                        className="h-full w-full object-cover object-center"
                        priority
                    />
                </div>
            </div>
            <div className="absolute top-0 pt-[5%] left-0 w-full h-full  md:bg-[#000]/60">
                <h2 className=" text-[35px] md:text-[50px] font-semibold text-black md:text-white text-center tracking-wider">
                    {title}
                </h2>
                <div className="flex items-center justify-center">
                    <div className="bg-black md:bg-white h-[1px] w-[100px]"></div>
                    <div className="bg-black md:bg-white h-[1px] w-[100px]"></div>
                </div>
            </div>
        </div>
    );
};

export default BannerContainer;
