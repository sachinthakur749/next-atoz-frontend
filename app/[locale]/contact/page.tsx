"use client";

import { useAuthContext } from '@/context/AuthProvider';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react'
import { BsInstagram } from 'react-icons/bs';
import { FaFacebookF, FaGoogle, FaLinkedin, FaPhoneAlt } from 'react-icons/fa';
import { IoLocation } from 'react-icons/io5';
import { MdEmail } from 'react-icons/md';

const page = () => {
    const t = useTranslations();
    const { productInfo } = useAuthContext()
    return (
        <div className="w-width_sm md:w-width_md lg:w-width_lg xl:w-width_xl 2xl:w-width_2xl min-h-[60vh] max-w-[1200px] mx-auto ">
            <h2 className=" text-[35px] mt-5  font-semibold text-black  text-center tracking-wider">
                <span className="border-b-[1px] pb-2 border-b-black">
                    {" "}
                    {t("getInTouch")}
                </span>
            </h2>
            <div className="flex max-md:gap-5 max-md:flex-col-reverse mt-5 max-md:px-5 py-5">
                <div className="w-[100%] md:w-[50%] space-y-5 ">
                    <p>{t("gotQuestion")}</p>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-5 ">
                            <div className="bg-[#ff572263] p-2 rounded-full">
                                <FaPhoneAlt className="text-primaryOrange" />
                            </div>
                            <span className="text-[14px] max-md:w-full max-md:break-words text-gray-700">
                                {" "}
                                {productInfo?.phone}
                            </span>
                        </div>
                        <div className="flex items-center gap-5 ">
                            <div className="bg-[#ff572263] p-2 rounded-full">
                                <IoLocation className="text-primaryOrange" />
                            </div>
                            <span className="text-[14px] max-md:w-full max-md:break-words text-gray-700">
                                {productInfo?.address}
                            </span>
                        </div>
                        <div className="flex items-center gap-5 ">
                            <div className="bg-[#ff572263] p-2 rounded-full">
                                <MdEmail className="text-primaryOrange" />
                            </div>
                            <span className="text-[14px] max-md:w-full max-md:break-words text-gray-700">
                                {productInfo?.email}
                            </span>
                        </div>
                    </div>
                    <div className=""></div>
                    <div className="">
                        <div className="flex items-center mt-10  gap-4">
                            {productInfo?.facebook_link && (
                                <Link target="_blank" href={productInfo?.facebook_link || ""}>
                                    <div className="bg-blue-500 p-2 rounded-full">
                                        <FaFacebookF className="text-white cursor-pointer" />
                                    </div>
                                </Link>
                            )}

                            {productInfo?.google_link && (
                                <Link target="_blank" href={productInfo?.google_link || ""}>
                                    <div className="bg-[#E44033] p-2 rounded-full">
                                        <FaGoogle className="text-white cursor-pointer" />
                                    </div>
                                </Link>
                            )}

                            {productInfo?.instagram_link && (
                                <Link target="_blank" href={productInfo?.instagram_link || ""}>
                                    <div className="bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-2 rounded-full">
                                        <BsInstagram className="text-white cursor-pointer" />
                                    </div>
                                </Link>
                            )}

                            {productInfo?.linkedin_link && (
                                <Link target="_blank" href={productInfo?.linkedin_link || ""}>
                                    <div className="bg-[#0A66C2] p-2 rounded-full">
                                        <FaLinkedin className="text-white cursor-pointer" />
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-[100%] md:w-[50%] ">
                    {/* <ContactForm /> */}
                </div>
            </div>
        </div>
    );
}

export default page