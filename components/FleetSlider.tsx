"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { GoPersonFill } from "react-icons/go";
import { MdLuggage } from "react-icons/md";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CmsGlobalType } from "@/types/auth";

const FleetSlider = ({ fleetsListData }: { fleetsListData: CmsGlobalType }) => {
    const sliderRef = useRef<Slider | null>(null);
    const router = useRouter();

    const handleNextSlide = () => {
        if (sliderRef?.current) {
            sliderRef?.current?.slickNext();
        }
    };

    const handlePrevSlide = () => {
        if (sliderRef?.current) {
            sliderRef?.current?.slickPrev();
        }
    };

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        swipeToSlide: true,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1,
                    dots: true,
                },
            },
        ],
    };

    console.log("rr", fleetsListData.length)

    return (
        <div style={{ height: '400px', border: '1px solid red' }} className="mt-[30px] relative slider-container w-full overflow-hidden">
            <Slider ref={sliderRef} {...settings}>
                {fleetsListData?.length > 0 &&
                    fleetsListData?.map((item, ind) => (
                        <div key={ind} className="relative w-full p-[10px]">
                            <div className=" w-full h-[300px] flex flex-col items-center p-[12px] rounded-sm">
                                <Link
                                    href='/fleets'
                                    className="relative h-[60%] w-full "
                                >
                                    <Image
                                        fill
                                        className="w-[260px] cursor-pointer m-auto hover:scale-[1.1] transition-all duration-200 h-full object-contain"
                                        src={`${item?.image_2_link}`}
                                        alt={item?.title}
                                        priority
                                        sizes="100%"
                                    />
                                </Link>
                                <div className="z-10 flex flex-col justify-center h-full w-full">
                                    <div className="w-full flex flex-col items-center">
                                        <p className="mt-[20px] max-w-[200px] text-center text-[18px] font-bold ">
                                            {item?.title}
                                        </p>
                                        <div className="flex justify-center gap-4">
                                            <p className="flex items-center ">
                                                <GoPersonFill /> X{item?.passenger ?? 1}
                                            </p>
                                            <p className="flex items-center ">
                                                <MdLuggage /> X{item?.luggage ?? 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </Slider>
            <div>
                <button
                    onClick={handlePrevSlide}
                    className="absolute left-[0px] top-[50%] -translate-y-[50%] bg-black rounded-full transition-all hover:scale-[0.9] w-[35px] h-[35px] flex items-center justify-center "
                >
                    <IoIosArrowBack className="text-white  " size={20} />
                </button>
                <button
                    onClick={handleNextSlide}
                    className="absolute right-[0px] top-[50%] -translate-y-[50%] bg-black rounded-full transition-all hover:scale-[0.9] w-[35px] h-[35px] flex items-center justify-center"
                >
                    <IoIosArrowForward className="text-white" size={20} />
                </button>
            </div>
        </div>
    );
};

export default FleetSlider;
