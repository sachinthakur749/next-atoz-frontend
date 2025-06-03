"use client";

import { useAuthContext } from '@/context/AuthProvider';
import { userServices } from '@/firebase/firebaseServices';
import useLocalStorage from '@/hooks/useLocalStorage';
import { usePathname, useRouter } from '@/i18n/navigation';
import { ServiceItem } from '@/types/auth';
import { DocumentData } from 'firebase/firestore';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CgMenuRightAlt } from 'react-icons/cg';
import { IoPerson } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import Navitems from './Navitems';
import Stepper from './Stepper';
import { useStepper } from '@/context/StepperContext';

interface NavbarProps {
    serviceLists: ServiceItem[];
    locationLists: ServiceItem[];
    fleetLists: ServiceItem[];
    siteInfo: SiteInfoType;
}

const Navbar = ({ serviceLists, locationLists, fleetLists, siteInfo }: NavbarProps) => {
    const router = useRouter()
    const pathname = usePathname();
    const { passengerIdentity } = useAuthContext();
    const { currentStep } = useStepper();
    const { getItem } = useLocalStorage()

    const [open, setOpen] = useState(false);
    const [userProfileData, setUserProfileData] = useState<DocumentData | null>(null);

    const t = useTranslations();
    const [showProfile, setShowProfile] = useState(false);



    const showDrawer = useCallback(() => {
        setOpen((prev) => !prev);
    }, []);

    const handleProfileClick = useCallback(() => {
        router.push("/profile/passenger");
    }, [router]);

    const steps = useMemo(() => {
        const STEPS = [
            { id: 1, title: `${t("vehicle_selection")}`, status: "current" },
            { id: 2, title: `${t("passenger_details")}`, status: "upcoming" },
            { id: 3, title: `${t("payment")}`, status: "upcoming" },
        ];

        return STEPS.map((step) => ({
            ...step,
            status:
                step.id < currentStep
                    ? "complete"
                    : step.id === currentStep
                        ? "current"
                        : "upcoming",
        }));
    }, [currentStep, t]);

    useEffect(() => {
        if (passengerIdentity) {
            userServices
                .getUserProfile(passengerIdentity)
                .then((profileData) => {
                    if (profileData) {
                        setUserProfileData(profileData);
                    }
                })
                .catch((err) => {
                    console.error("Profile load error:", err.message);

                });
        }
    }, [passengerIdentity]);

    console.log(siteInfo.logo_url)





    return (
        <>
            <div className="w-full p-[10px] flex border border-[#e2e2e2] justify-center shadow-md">
                <div className="w-full flex items-center justify-between">
                    <div
                        onClick={() => router.push("/")}
                        className="flex items-center cursor-pointer gap-3"
                    >
                        <div className="h-[70px] object-contain overflow-hidden flex items-center justify-center">
                            {siteInfo?.logo_url && (
                                <img
                                    loading="lazy"
                                    src={siteInfo?.logo_url}
                                    alt="logo"
                                    className="h-full w-full  object-contain object-left"
                                />
                            )}
                        </div>
                        {siteInfo?.show_company_name === 1 && (
                            <h2 className="text-wrap font-semibold tracking-tighter text-[22px] ml-1 text-[#1c1c1c]">
                                {siteInfo?.name}
                            </h2>
                        )}
                    </div>

                    <div
                        className={`hidden md:flex ${pathname.includes("quote") ? "w-[50%]" : ""
                            } items-center gap-20`}
                    >
                        {pathname.includes("quote") ? (
                            <Stepper steps={steps} />
                        ) : (
                            <Navitems
                                locationLists={locationLists}
                                serviceLists={serviceLists}
                            />
                        )}
                    </div>

                    <div className="md:flex hidden justify-start items-center gap-2">
                        {/* <LanguageSwitcher /> */}
                        <div className="relative">
                            {getItem("passenger_user") ? (
                                <div
                                    onClick={handleProfileClick}
                                    className="flex cursor-pointer items-center"
                                >
                                    <div className="w-max px-[10px] mr-[-10px] border-[1px] border-slate-300 rounded-[5px] flex gap-2 justify-center items-center text-center text-black py-5 h-6 bg-smoke">
                                        <p>
                                            {t("hi")}, {userProfileData?.name?.slice(0, 10) + "..."}
                                        </p>
                                        <div>
                                            <img
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowProfile(!showProfile);
                                                }}
                                                className="cursor-pointer w-[30px] h-[30px] rounded-full bg-white ring-[2px] object-contain ring-primaryOrange"
                                                src={userProfileData?.image_link}
                                                loading="lazy"
                                                alt="profile"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href="/login/passenger"
                                    className="border-[1px] bg-smoke flex items-center gap-2 px-[10px] py-[6px] rounded-[5px]"
                                >
                                    <p className="flex items-center gap-[2px] text-[18px]">
                                        <IoPerson /> {t("login")}
                                    </p>
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="block md:hidden">
                        {open ? (
                            <RxCross2
                                onClick={showDrawer}
                                className="text text-[#525255]"
                                size={30}
                            />
                        ) : (
                            <CgMenuRightAlt
                                onClick={showDrawer}
                                className="text text-[#525255]"
                                size={40}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar