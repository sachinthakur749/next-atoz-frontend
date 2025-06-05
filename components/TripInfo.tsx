
"use client";

import { useStepper } from "@/context/StepperContext";
import { DateTimeFormatter } from "@/lib/timeUtilis";
import { Fleet, QuoteDetails } from "@/types";
import { useEffect, useState } from "react";
import { RxDotFilled } from "react-icons/rx";
import GoogleMapDirection from "./GoogleMapDirection";

interface TripInfoProps {
    passenger?: number;
    luggage?: number;
}


const TripInfo = ({ passenger, luggage }: TripInfoProps) => {
    //   const location = useLocation();


    const [quoteData, setQuoteData] = useState<QuoteDetails | null>(null);
    const { nextStep, prevStep, currentStep, steps } = useStepper();

    const [selectedFleet, setSelectedFleet] = useState<Fleet | null>(null);
    const combined_date_time = DateTimeFormatter(
        quoteData?.pickup_date ?? "",
        quoteData?.pickup_time ?? ""
    );

    useEffect(() => {
        const quote = localStorage.getItem("quote");
        const fleet = localStorage.getItem("selected_fleet");

        if (quote) {
            setQuoteData(JSON.parse(quote));
        }

        if (fleet) {
            setSelectedFleet(JSON.parse(fleet));
        }
    }, [location]);

    const {
        from_lat,
        from_lng,
        to_lat,
        to_lng,
        via,
        from_location,
        to_location,
        pickup_date,
        pickup_time,
        return_date,
        return_time,
        distance,
        duration,
        service_type,
    } = quoteData || {};

    return (
        <div className="bg-[#F5F5F6] flex flex-col-reverse  md:flex-row gap-2 justify-between p-4 rounded-lg">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <p className="text-gray-600 text-sm">{combined_date_time}</p>
                    <div className="space-y-1">
                        <p className="text-gray-900 font-medium">
                            {from_location} -&gt; {to_location}
                        </p>
                        <p className="text-gray-600 text-sm flex">
                            {duration} | {distance}{" "}
                            {selectedFleet?.fare && currentStep != 1 && (
                                <>
                                    <RxDotFilled size={20} className="text-gray-600" />{" "}
                                    <span className="font-semibold">{selectedFleet?.fare}</span>
                                </>
                            )}
                        </p>
                    </div>
                    {selectedFleet && currentStep !== 1 && (
                        <div className="flex">
                            <div>
                                <img
                                    className="w-[50px] h-8 object-contain object-left"
                                    src={selectedFleet?.image_link}
                                    alt=""
                                />
                            </div>
                            <div className="flex gap-2 items-center ">
                                <div className="flex flex-col">
                                    <label className="text-[14px] ml-2">
                                        {selectedFleet?.class_name} {selectedFleet?.type_name}
                                    </label>{" "}
                                    {/* <label className="text-[14px] ml-2">
                    {selectedFleet?.fare}
                  </label>{" "} */}
                                </div>

                                {passenger || luggage ? (
                                    <>
                                        <RxDotFilled size={20} className="text-gray-600" />
                                        <div className="flex gap-4">
                                            <div className="flex items-center justify-center">
                                                <img
                                                    className="object-contain w-4 h-4 "
                                                    src="/assets/icons/user-group.png"
                                                    alt=""
                                                />{" "}
                                                <p>{passenger}</p>
                                            </div>
                                            <div className="flex items-center justify-center">
                                                <img
                                                    className="object-contain w-4 h-4"
                                                    src="/assets/icons/hand-bag-01.png"
                                                    alt=""
                                                />{" "}
                                                <p>{luggage}</p>
                                            </div>
                                        </div>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="w-full md:w-[250px] h-[150px] border-[1px] border-slate-300 rounded-[12px] ">
                {quoteData && (
                    <GoogleMapDirection
                        from_lat={from_lat}
                        from_lng={from_lng}
                        to_lat={to_lat}
                        to_lng={to_lng}
                        via={via}
                        routes={quoteData.polyline_points}
                    />
                )}
            </div>
        </div>
    );
};

export default TripInfo;
