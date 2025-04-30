import Image from 'next/image'
import React from 'react'

const HeroSection = ({ bannerImage }) => {
    return (
        <div className="relative w-full h-max flex flex-col items-center">
            <div className="relative w-full bg-slate-400">
                <div className="w-full flex justify-center bg-white">
                    <h2 className="w-width_sm md:w-width_md lg:w-width_lg py-3 xl:w-width_xl p-3 2xl:w-width_2xl text-[28px] font-[400]">
                        a complete section
                    </h2>
                </div>
            </div>
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
            <div className="block md:hidden w-full">
                {/* <QuoteCard /> */}
            </div>

            <div className="z-[20] w-[450px] absolute top-[350px] md:top-[100px] lg:top-[30px] right-0 -translate-x-[20%] md:flex hidden justify-end ">
                {/* <QuoteCard /> */}
            </div>
        </div>
    )
}

export default HeroSection