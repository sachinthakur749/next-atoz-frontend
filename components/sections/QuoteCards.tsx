"use client";

import { listenToGlobalData } from "@/firebase/firebaseServices";
import { DocumentData } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import QuoteForm from "./QuoteForm";

const QuoteCard = () => {
    const t = useTranslations();
    const [activeTab, setActiveTab] = useState("transfer-only");
    const [globalData, setGlobalData] = useState<DocumentData | null>(null);

    useEffect(() => {
        const unsubscribe = listenToGlobalData((data) => {
            setGlobalData(data);
        });
        return () => unsubscribe?.();
    }, []);

    console.log(activeTab)

    return (
        <div
            style={{
                boxShadow: "0 12px 28px #64666b",
            }}
            className="w-full overflow-hidden bg-white rounded-[4px] "
        >
            <div
                className={`w-full grid tabs ${globalData?.service_types?.point_to_point &&
                    globalData?.service_types?.hourly
                    ? "grid-cols-2"
                    : ""
                    }  grid-cols-1`}
            >
                {globalData?.service_types?.point_to_point && (
                    <button
                        onClick={() => {
                            setActiveTab("transfer-only");
                        }}
                        className={`  col-span-1 text-center p-[16px] text-[17px] font-bold ${activeTab == "transfer-only" ? "bg-white " : "bg-[#f0f2f7]"
                            } `}
                    >
                        {globalData?.service_type_names?.point_to_point
                            ? t("schedule")
                            : t("transfer_only")}
                    </button>
                )}
                {globalData?.service_types?.hourly && (
                    <button
                        onClick={() => {
                            setActiveTab("by-the-hour");
                        }}
                        className={` ${globalData?.service_types?.hourly &&
                            !globalData?.service_types?.point_to_point
                            ? "bg-white"
                            : ""
                            } col-span-1 text-center p-[16px] text-[17px] font-bold ${activeTab == "by-the-hour" ? "bg-white " : "bg-smoke"
                            } `}
                    >
                        {globalData?.service_type_names?.hourly
                            ? t("book_a_ride")
                            : t("hourly")}
                    </button>
                )}
            </div>

            {activeTab === "transfer-only" && (
                <QuoteForm
                    isReturn={globalData?.service_types?.return ?? true}
                    bookingRequest={globalData?.booking_request ?? 60}
                    rateSystem={globalData?.rate_system_id}
                    viaName={globalData?.service_type_names?.via}
                />
            )}


        </div>
    );
};

export default QuoteCard;
