"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { ServiceItem } from "@/types/auth";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface NavItemsProps {
    locationLists: ServiceItem[];
    serviceLists: ServiceItem[];

}


const NavItems = ({ locationLists, serviceLists }: NavItemsProps) => {
    const router = useRouter();
    const t = useTranslations();
    const [activeMenu, setActiveMenu] = useState<string | React.SetStateAction<null>>(null);
    const [isPortmingo, setIsPortmingo] = useState(false);


    const handleMouseEnter = (menu: string | React.SetStateAction<null>) => setActiveMenu(menu);
    const handleMouseLeave = () => setActiveMenu(null);

    const commonClasses = "text-[17px] tracking-wide font-semibold text-[#000]";
    const dropdownClass =
        "z-10 absolute w-[200px] top-[25px] bg-white overflow-hidden rounded-md min-w-[180px] max-h-[300px] overflow-y-auto shadow-lg";

    const renderDropdown = (items: ServiceItem[], pathPrefix: string) => (
        <div className={dropdownClass}>
            {items?.map((item, idx) => (
                <p
                    key={idx}
                    onClick={() => router.push(`/${pathPrefix}/${item.slug}`)}
                    className="flex w-full items-center justify-between text-[#525255] text-[13px] tracking-normal font-medium px-2 py-2 hover:bg-smoke"
                >
                    {item.title}
                </p>
            ))}
        </div>
    );

    useEffect(() => {
        const hostname = window.location.hostname;
        setIsPortmingo(hostname.endsWith("portmingo.com"));
    }, []);

    return (
        <div className="flex mr-[-20px] navs items-center gap-10">
            <Link href="/">
                <h3 className={commonClasses}>{t("home")}</h3>
            </Link>

            <Link href="/about-us">
                <h3 className={commonClasses}>{t("about_us")}</h3>
            </Link>

            {!isPortmingo && (
                <div
                    onMouseEnter={() => handleMouseEnter("fleet")}
                    onMouseLeave={handleMouseLeave}
                    className="relative cursor-pointer"
                >
                    <Link href="/fleet">
                        <h3 className={commonClasses}>{t("fleet")}</h3>
                    </Link>
                </div>
            )}

            <div
                onMouseEnter={() => handleMouseEnter("services")}
                onMouseLeave={handleMouseLeave}
                className="relative cursor-pointer"
            >
                <div className="flex items-center gap-2">
                    <Link href="/our-services">
                        <h3 className={commonClasses}>{t("services")}</h3>
                    </Link>
                    <img src="/assets/icons/down_arrow.svg" alt="▼" />
                </div>
                {activeMenu === "services" &&
                    renderDropdown(serviceLists, "our-services")}
            </div>

            <div
                onMouseEnter={() => handleMouseEnter("areas")}
                onMouseLeave={handleMouseLeave}
                className="relative cursor-pointer"
            >
                <div className="flex items-center gap-2">
                    <Link href="/locations">
                        <h3 className={commonClasses}>{t("areas")}</h3>
                    </Link>
                    <img src="/assets/icons/down_arrow.svg" alt="▼" />
                </div>
                {activeMenu === "areas" && renderDropdown(locationLists, "locations")}
            </div>
        </div>
    );
};

export default React.memo(NavItems);
