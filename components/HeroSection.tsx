import Image from 'next/image'
import React from 'react'
import QuoteCards from './sections/QuoteCards';

interface HeroSectionProps {
    bannerImage: string;
}

const HeroSection = ({ bannerImage }: HeroSectionProps) => {
    return (
        <div className="relative  w-full h-max flex flex-col items-center">


            <div className="w-full h-[20vh] md:h-[70vh]">
                {bannerImage ? (
                    <>
                        <Image
                            priority
                            fill
                            src={bannerImage}
                            alt="images of our services"
                            sizes="100vw"
                            className="object-cover"
                        />
                    </>
                ) : (
                    <>
                        <div className="w-full animate-pulse h-full bg-slate-500"></div>
                    </>
                )}
            </div>


            <div className="block z-[20] md:hidden w-full">
                <QuoteCards />
            </div>

            <div className="z-[20] w-[450px] absolute top-[350px] md:top-[100px] lg:top-[-30px] right-0 -translate-x-[20%] md:flex hidden justify-end ">
                <QuoteCards />
            </div>
        </div>
    )
}

export default HeroSection