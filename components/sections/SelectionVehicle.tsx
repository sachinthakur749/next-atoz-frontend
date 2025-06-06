"use client";

import { useEffect, useState } from "react";
import { useStepper } from "../../context/StepperContext";
import useLocalStorage from "../../hooks/useLocalStorage";
import FleetCard from "../FleetCard";
import { useTranslations } from "next-intl";
import BookingFormLayout from "../layout/BookFormLayout";
import TripInfo from "../TripInfo";
import { Fleet } from "@/types";



interface VehicleListProps {
    fleets: Fleet[];
    selectedVehicle: Fleet | string | number | null;
    onSelectVehicle: (vehicle: Fleet) => void;
}

const VehicleList = ({ fleets, selectedVehicle, onSelectVehicle }: VehicleListProps) => {
    return (
        <div className="flex flex-col gap-4 ">
            {fleets.map((item, index) => (
                <div
                    key={item.fleet_id}
                    onClick={() => onSelectVehicle(item)}
                    className={`cursor-pointer relative p-2 transition-all  duration-300 ${item.fleet_id === selectedVehicle
                        ? "border-[3px] shadow-lg shadow-gray-500 border-primaryOrange"
                        : "border-2 border-slate-200"
                        } ${index === 0 ? "rounded-t-[10px]" : ""} ${index === fleets.length - 1 ? "rounded-b-[10px]" : ""
                        }`}
                >
                    <FleetCard
                        fleetImage={item.image_link}
                        fleetName={`${item.class_name} ${item.type_name}`}
                        fleetType={item.type_name}
                        price={item.fare}
                        passengers={item.passenger}
                        luggage={item.luggage}
                    />
                </div>
            ))}
        </div>
    );
};

const FooterButtons = ({ onContinue }: { onContinue: () => void }) => {
    const t = useTranslations();
    return (
        <div className="w-full  mt-2 bg-white sticky bottom-0 py-4 flex justify-between px-4 rounded-[12px] bg-gradient-to-t from-white to-transparent">
            <div className=" w-[710px] mx-auto flex flex-col md:flex-row gap-5 justify-center">
                <button
                    onClick={onContinue}
                    className="w-full md:w-1/2 bg-primary font-normal tracking-wider uppercase py-[15px] px-[32px]  text-white rounded"
                >
                    {t("continue")}
                </button>
            </div>
        </div>
    );
};



const SelectVehicle = ({ setIsLoginModalOpen }: { setIsLoginModalOpen: (value: boolean) => void; }) => {
    const t = useTranslations();
    const { getItem } = useLocalStorage();
    const { nextStep } = useStepper();
    const [selectedVehicle, setSelectedVehicle] = useState<Fleet | null | number>(null);
    const [responseData, setResponseData] = useState<{ fleets: Fleet[] } | null>(null);

    useEffect(() => {
        const storedData = localStorage.getItem("quote");
        if (storedData) {
            const data = JSON.parse(storedData);
            setResponseData(data);
            if (data.fleets?.length > 0) {
                setSelectedVehicle(data.fleets[0].fleet_id);
                localStorage.setItem("selected_fleet", JSON.stringify(data.fleets[0]));
            }
        }
    }, []);

    const handleSelectVehicle = (vehicle: Fleet) => {
        localStorage.setItem("selected_fleet", JSON.stringify(vehicle));
        setSelectedVehicle(vehicle.fleet_id);
    };

    const handleContinue = () => {
        getItem("passenger_user") ? nextStep() : setIsLoginModalOpen(true);
    };

    return (
        <div className="relative">
            <BookingFormLayout>
                <div className="p-2 bg-white space-y-5  flex flex-col">
                    <TripInfo />
                    <label className="font-bold text-lg">
                        {t("please_select_the_vehicle")}
                    </label>
                    <div className="max-h-[1000px] py-5 overflow-y-scroll ">
                        {responseData && (
                            <VehicleList
                                fleets={responseData.fleets}
                                selectedVehicle={selectedVehicle}
                                onSelectVehicle={handleSelectVehicle}
                            />
                        )}
                    </div>
                </div>
            </BookingFormLayout>
            <FooterButtons onContinue={handleContinue} />
        </div>
    );
};

export default SelectVehicle;
