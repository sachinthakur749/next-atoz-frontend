"use client";

import { useEffect, useRef, useState } from "react";
import { MdLocationOn, MdOutlineAccessTimeFilled } from "react-icons/md";
import { BsPlus } from "react-icons/bs";
import { FaTimesCircle, FaLuggageCart } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ConfigProvider, TimePicker } from "antd";
import moment from "moment";
import { useTranslations } from "next-intl";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useStepper } from "@/context/StepperContext";
import { postRequest } from "@/lib/apiServices";
import { useAuthContext } from "@/context/AuthProvider";
import { addBookingTimeToBase, calculateMinMaxTimes, convertMinutesToHours, getLocalTime, getTimeZone, normalizeDate } from "@/lib/timeUtilis";
import useCustomNavigate from "@/hooks/useCustomNavigate";
import { Button } from "../ui/Button";
import { FaPeopleGroup } from "react-icons/fa6";
import AutoCompleteInput from "../ui/AutoCompleteInput";


// Type definitions
interface FormData {
    from_location: string;
    from_lat: string;
    from_lng: string;
    to_location: string;
    to_lat: string;
    to_lng: string;
    pickup_date: string;
    pickup_time: string;
    booking_type: string;
    service_type: string;
    return_date: string | null;
    return_time: string | null;
    journey_type: string;
    passenger?: number;
    luggage?: number;
    via?: any[];
}

interface TransferOnlyProps {
    bookingRequest: any;
    isReturn: boolean;
    rateSystem?: number;
    viaName?: string;
}

const QuoteForm: React.FC<TransferOnlyProps> = ({
    bookingRequest,
    isReturn,
    rateSystem,
    viaName
}) => {
    const t = useTranslations();
    const { goToStep } = useStepper();
    const { removeItem } = useLocalStorage();
    const navigateToPath = useCustomNavigate();
    const { productInfo } = useAuthContext();

    const dateRef = useRef<HTMLInputElement>(null);
    const [isChecked, setIsChecked] = useState(false);
    const [viaPoints, setViaPoints] = useState<any[]>([]);
    const [pickupLocationTimezone, setPickupLocationTimezone] = useState("");
    const [localTime, setLocalTime] = useState<string | null>(null);
    const [minTime, setMinTime] = useState({ hour: 0, minute: 0 });
    const [minReturnTime, setMinReturnTime] = useState({ hour: 0, minute: 0 });
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [error, setError] = useState<{ title: string | null; message: string | null }>({
        title: null,
        message: null
    });

    const [activeTab, setActiveTab] = useState<"now" | "later">("later");
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<Date | null>(null);
    const [returnSelectedDay, setReturnSelectedDay] = useState<Date | null>(null);
    const [returnSelectedTime, setReturnSelectedTime] = useState<Date | null>(null);

    const [formData, setFormData] = useState<FormData>({
        from_location: "",
        from_lat: "",
        from_lng: "",
        to_location: "",
        to_lat: "",
        to_lng: "",
        pickup_date: "",
        pickup_time: "",
        booking_type: "scheduled",
        service_type: "point_to_point",
        return_date: null,
        return_time: null,
        journey_type: "one_way"
    });

    // Handle checkbox change for return trip
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setIsChecked(isChecked);
        setFormData(prev => ({
            ...prev,
            journey_type: isChecked ? "two_way" : "one_way"
        }));
    };

    // Handle numeric input changes (passengers, luggage)
    const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numericValue = Math.min(Number(value), 100);

        setFormData(prev => ({
            ...prev,
            [name]: numericValue
        }));
    };

    // Handle date selection
    const handleDateSelection = (date: Date | null) => {
        if (!date) {
            setSelectedDay(null);
            setFormData(prev => ({
                ...prev,
                pickup_date: ""
            }));
            return;
        }

        setSelectedDay(date);
        setFormData(prev => ({
            ...prev,
            pickup_date: moment(date).format("YYYY-MM-DD")
        }));

        // Reset return date if it's before the new pickup date
        if (returnSelectedDay && moment(returnSelectedDay).isBefore(date)) {
            setReturnSelectedDay(null);
            setFormData(prev => ({
                ...prev,
                return_date: ""
            }));
        }
    };

    // Handle time selection
    const handleTimeSelection = (time: Date | null) => {
        if (!time) return;

        setSelectedTime(time);
        setFormData(prev => ({
            ...prev,
            pickup_time: moment(time).format("HH:mm:ss")
        }));
    };

    // Handle return date selection
    const handleReturnDateSelection = (date: Date | null) => {
        if (!date) {
            setReturnSelectedDay(null);
            setFormData(prev => ({
                ...prev,
                return_date: ""
            }));
            return;
        }

        setReturnSelectedDay(date);
        setFormData(prev => ({
            ...prev,
            return_date: moment(date).format("YYYY-MM-DD")
        }));
    };


    const handleReturnTimeSelection = (time: Date | null) => {
        if (!time) return;

        setReturnSelectedTime(time);
        setFormData(prev => ({
            ...prev,
            return_time: moment(time).format("HH:mm:ss")
        }));
    };

    // Handle via points management
    const handleAddViaPoint = () => {
        if (viaPoints.length < 4) {
            setViaPoints([...viaPoints, {}]);
        }
    };

    const handleRemoveViaPoint = (index: number) => {
        const updatedViaPoints = viaPoints.filter((_, i) => i !== index);
        setViaPoints(updatedViaPoints);
    };

    // Calculate disabled times for time picker
    const getDisabledTimes = (isReturnPicker = false) => {
        const { hour, minute } = isReturnPicker ? minReturnTime : minTime;

        return {
            disabledHours: () => Array.from({ length: hour }, (_, i) => i),
            disabledMinutes: (selectedHour: number) => {
                if (selectedHour === hour) {
                    return Array.from({ length: minute }, (_, i) => i);
                }
                return [];
            }
        };
    };

    // Handle form submission
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError({ title: null, message: null });
        setLoading(true);

        const formDataToSend = new FormData();
        formDataToSend.append("is_now", activeTab === "now" ? "true" : "false");

        // Append all form data to FormData object
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formDataToSend.append(key, value.toString());
            }
        });

        try {
            const response = await postRequest("quote", formDataToSend);
            setLoading(false);

            // Store quote data
            if (typeof window !== "undefined") {
                localStorage.setItem("quote", JSON.stringify(response?.data));
                localStorage.setItem("quote_id", response?.data?.quote_id);
            }

            goToStep(1);
            navigateToPath("/quote", false);
        } catch (error: any) {
            setLoading(false);
            setError({
                title: error?.response?.data?.title,
                message: error?.response?.data?.message
            });

            if (error?.response?.data?.data?.no_rate) {
                setShowAlert(true);
            }
        }
    };

    // Effects for time calculations
    useEffect(() => {
        if (activeTab === "now" && localTime) {
            const { hours, minutes } = convertMinutesToHours(bookingRequest);
            const timeOnly = localTime.split(" ")[1];
            const time = addBookingTimeToBase(timeOnly, hours, minutes + 1);

            setFormData(prev => ({
                ...prev,
                pickup_time: time
            }));
        }
    }, [localTime, activeTab, bookingRequest]);

    useEffect(() => {
        if (!localTime || !pickupLocationTimezone || !selectedDay) return;

        const isSameDay = normalizeDate(new Date(localTime)).getTime() ===
            normalizeDate(selectedDay).getTime();

        if (isSameDay) {
            const { minHour, minMinute } = calculateMinMaxTimes(
                localTime,
                productInfo?.time_format_24
            );
            const { hours, minutes } = convertMinutesToHours(bookingRequest);

            setMinTime({
                hour: minHour + hours,
                minute: Number(minMinute) + minutes
            });
        } else {
            setMinTime({ hour: 0, minute: 0 });
        }
    }, [localTime, pickupLocationTimezone, selectedDay]);

    useEffect(() => {
        if (!localTime || !pickupLocationTimezone || !returnSelectedDay) return;

        const isSameDay = normalizeDate(new Date(localTime)).getTime() ===
            normalizeDate(returnSelectedDay).getTime();

        if (isSameDay) {
            const { minHour, minMinute } = calculateMinMaxTimes(
                localTime,
                productInfo?.time_format_24
            );
            const { hours, minutes } = convertMinutesToHours(bookingRequest);

            setMinReturnTime({
                hour: minHour + hours,
                minute: Number(minMinute) + minutes
            });
        } else {
            setMinReturnTime({ hour: 0, minute: 0 });
        }
    }, [localTime, pickupLocationTimezone, returnSelectedDay]);

    return (
        <>
            <form
                onSubmit={handleFormSubmit}
                className="w-full bg-white flex flex-col gap-2 p-[15px]"
            >
                {/* Pickup Location */}
                <div className="w-full bg-smoke flex items-center gap-3 px-[10px] py-[5px] rounded-[4px] group focus-within:border focus-within:border-primary">
                    <MdLocationOn size={25} className="text-[18px] text-[#64666b]" />
                    <div className="grow flex flex-col gap-1">
                        <label className="font-semibold text-[14px] text-[#000000]">
                            {t("from")}
                        </label>
                        <AutoCompleteInput
                            go="from"
                            setFormData={setFormData}
                            required={true}
                            placeholder={t("pickup_address")}
                            getLatLng={async (lat, lng) => {
                                const timeZoneData = await getTimeZone(lat, lng);
                                setPickupLocationTimezone(timeZoneData?.timeZoneId);
                                setLocalTime(getLocalTime(timeZoneData?.timeZoneId));
                            }}
                        />
                    </div>
                </div>

                {/* Via Points */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleAddViaPoint}
                        disabled={viaPoints.length >= 2}
                        className={`${viaPoints.length >= 2 ? "bg-slate-500/50" : "bg-primary"
                            } cursor-pointer flex items-center text-white px-[8px] py-[4px] rounded-md`}
                    >
                        <BsPlus size={20} /> {viaName ? t("stop") : t("via")}
                    </button>
                </div>

                {viaPoints.map((_, index) => (
                    <div
                        key={index}
                        className="w-full bg-smoke flex items-center gap-3 px-[10px] py-[5px] rounded-[4px] group focus-within:border focus-within:border-primary"
                    >
                        <MdLocationOn size={25} className="text-[18px] text-[#64666b]" />
                        <div className="grow flex flex-col gap-0">
                            <label className="font-semibold text-[14px] text-[#0a0a0a]">
                                {viaName ? t("stop") : t("via")}
                            </label>
                            <AutoCompleteInput
                                go={`via[${index}]`}
                                required={false}
                                setFormData={setFormData}
                                placeholder={`${t("via")} ${t("address")} ${index + 1}`}
                                getLatLng={() => {
                                    console.log("");
                                }}

                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoveViaPoint(index)}
                            className="cursor-pointer"
                        >
                            <FaTimesCircle className="text-red-500" size={20} />
                        </button>
                    </div>
                ))}

                {/* Dropoff Location */}
                <div className="w-full bg-smoke flex items-center gap-3 px-[10px] py-[5px] rounded-[4px] group focus-within:border focus-within:border-primary">
                    <MdLocationOn size={25} className="text-[18px] text-[#64666b]" />
                    <div className="grow flex flex-col gap-0">
                        <label className="font-semibold text-[14px] text-[#000000]">
                            {t("to")}
                        </label>
                        <AutoCompleteInput
                            go="to"
                            setFormData={setFormData}
                            required={true}
                            placeholder={t("drop_off_address")}
                            getLatLng={() => {
                                console.log("");
                            }}
                        />
                    </div>
                </div>

                {/* Booking Type Toggle */}
                <div className="flex justify-end">
                    <div className="flex justify-end bg-gray-300 rounded-full p-1 w-fit text-[12px] font-semibold">
                        <button
                            type="button"
                            onClick={() => setActiveTab("now")}
                            className={`px-4 py-1 rounded-full ${activeTab === "now"
                                ? "bg-primary text-white"
                                : "bg-transparent text-black"
                                }`}
                        >
                            {t("book_now")}
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("later")}
                            className={`px-4 py-1 rounded-full ${activeTab === "later"
                                ? "bg-primary text-white"
                                : "bg-transparent text-black"
                                }`}
                        >
                            {t("book_later")}
                        </button>
                    </div>
                </div>

                {activeTab === "later" && (
                    <>
                        {/* Pickup Date */}
                        <div
                            onClick={() => dateRef.current?.click()}
                            className="w-full bg-smoke flex items-center gap-3 px-[10px] py-[5px] rounded-[4px] group focus-within:border focus-within:border-primaryOrange"
                        >
                            <img
                                src="/assets/icons/calendar.svg"
                                alt="calendar"
                                onClick={() => document.getElementById("dateInput")?.focus()}
                            />
                            <div className="grow flex flex-col gap-0">
                                <label className="font-semibold text-[14px] text-[#000000]">
                                    {t("date")}
                                </label>
                                <DatePicker
                                    id="date"
                                    dateFormat={productInfo?.date_format || "dd/MM/yyyy"}
                                    required
                                    selected={selectedDay}
                                    onChange={handleDateSelection}
                                    minDate={new Date()}
                                    placeholderText={t("pickup_date")}
                                    className="bg-transparent focus:outline-none outline-none"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        {/* Pickup Time */}
                        <div className="w-full bg-smoke flex items-center gap-3 px-[10px] py-[5px] rounded-[4px] group focus-within:border focus-within:border-primaryOrange">
                            <MdOutlineAccessTimeFilled
                                size={25}
                                className="text-[18px] text-[#64666b]"
                            />
                            <div className="grow flex flex-col gap-0">
                                <label className="font-semibold text-[14px] text-[#000000]">
                                    {t("time")}
                                </label>
                                <ConfigProvider
                                    theme={{
                                        components: {
                                            DatePicker: {
                                                activeBorderColor: "#fff",
                                                activeShadow: "none",
                                                paddingInline: 0,
                                                colorText: "#000"
                                            }
                                        }
                                    }}
                                >
                                    <TimePicker
                                        format={productInfo?.time_format_24 == 0 ? "h:mm a" : "HH:mm"}
                                        use12Hours={productInfo?.time_format_24 == 0}
                                        placeholder={t("pickup_time")}
                                        required
                                        needConfirm={false}
                                        minuteStep={5}
                                        showNow={false}
                                        suffixIcon={null}
                                        disabledTime={() => getDisabledTimes()}
                                        onChange={handleTimeSelection}
                                        className="w-full time-input font-semibold placeholder:font-medium text-[14px] h-full bg-transparent hover:bg-[#ededed] focus:bg-[#ededed] outline-none border-none"
                                    />
                                </ConfigProvider>
                            </div>
                        </div>
                    </>
                )}

                {/* Passenger and Luggage */}
                {rateSystem === 3 && (
                    <div className="flex gap-2">
                        <div className="w-full bg-smoke flex items-center gap-3 px-[10px] py-[5px] rounded-[4px] group focus-within:border focus-within:border-primaryOrange">
                            <FaPeopleGroup size={25} className="text-[18px] text-[#64666b]" />
                            <div className="grow flex flex-col gap-0">
                                <label className="font-semibold text-[14px] text-[#000000]">
                                    {t("passenger")}
                                </label>
                                <input
                                    name="passenger"
                                    className="w-full bg-transparent border-none outline-none placeholder:text-[#9FA6B2]"
                                    type="number"
                                    placeholder={t("no_of_passenger")}
                                    onChange={handleNumericInputChange}
                                    min="1"
                                    max="100"
                                    value={formData?.passenger || ""}
                                    required
                                />
                            </div>
                        </div>
                        <div className="w-full bg-smoke flex items-center gap-3 px-[10px] py-[5px] rounded-[4px] group focus-within:border focus-within:border-primaryOrange">
                            <FaLuggageCart size={25} className="text-[18px] text-[#64666b]" />
                            <div className="grow flex flex-col gap-0">
                                <label className="font-semibold text-[14px] text-[#000000]">
                                    {t("luggage")}
                                </label>
                                <input
                                    name="luggage"
                                    className="w-full bg-transparent border-none outline-none placeholder:text-[#9FA6B2]"
                                    type="number"
                                    placeholder={t("no_of_luggage")}
                                    onChange={handleNumericInputChange}
                                    min="0"
                                    max="100"
                                    value={formData?.luggage || ""}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Return Trip Checkbox */}
                {isReturn && (
                    <div className="flex justify-start gap-2">
                        <label className="font-semibold text-titleColor">
                            {t("return")}
                        </label>
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                        />
                    </div>
                )}

                {/* Return Trip Fields */}
                {isChecked && (
                    <>
                        <div
                            onClick={() => dateRef.current?.click()}
                            className="w-full bg-smoke flex items-center gap-3 px-[10px] py-[5px] rounded-[4px] group focus-within:border focus-within:border-primaryOrange"
                        >
                            <img
                                src="/assets/icons/calendar.svg"
                                alt="calendar"
                                onClick={() => document.getElementById("dateInput")?.focus()}
                            />
                            <div className="grow flex flex-col gap-0">
                                <label className="font-semibold text-[14px] text-[#000000]">
                                    {t("return")} {t("date")}
                                </label>
                                <DatePicker
                                    id="returnDate"
                                    required={true}
                                    dateFormat={productInfo?.date_format || "dd/MM/yyyy"}
                                    selected={returnSelectedDay}
                                    onChange={handleReturnDateSelection}
                                    minDate={selectedDay || new Date()}
                                    placeholderText={`${t("return")} ${t("date")}`}
                                    className="bg-transparent outline-none"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="w-full bg-smoke flex items-center gap-3 px-[10px] py-[5px] rounded-[4px] group focus-within:border focus-within:border-primaryOrange">
                            <MdOutlineAccessTimeFilled
                                size={25}
                                className="text-[18px] text-[#64666b]"
                            />
                            <div className="grow flex flex-col gap-0">
                                <label className="font-semibold text-[14px] text-[#000000]">
                                    {t("return")} {t("time")}
                                </label>
                                <ConfigProvider
                                    theme={{
                                        components: {
                                            DatePicker: {
                                                activeBorderColor: "#fff",
                                                activeShadow: "none",
                                                paddingInline: 0
                                            }
                                        }
                                    }}
                                >
                                    <TimePicker
                                        format={productInfo?.time_format_24 == 0 ? "h:mm a" : "HH:mm"}
                                        required
                                        use12Hours={productInfo?.time_format_24 == 0}
                                        placeholder={`${t("return")} ${t("time")}`}
                                        needConfirm={false}
                                        minuteStep={5}
                                        showNow={false}
                                        suffixIcon={null}
                                        disabledTime={() => getDisabledTimes(true)}
                                        onChange={handleReturnTimeSelection}
                                        className="w-full font-semibold text-[14px] h-full bg-transparent hover:bg-[#ededed] focus:bg-[#ededed] outline-none border-none"
                                    />
                                </ConfigProvider>
                            </div>
                        </div>
                    </>
                )}

                {error?.message && (
                    <p className="text-red-500 text-[13px] italic">*{error.message}</p>
                )}

                <Button type="submit" loading={loading}>
                    {t("get_a_quote")}
                </Button>
            </form>

            {/* <QuoteErrorPopup
        open={showAlert}
        pickupLocation={formData.from_location}
        dropoffLocation={formData.to_location}
        pickupDate={formData.pickup_date}
        pickupTime={formData.pickup_time}
        errorMessage={error}
        handleModalClose={() => setShowAlert(false)}
      /> */}
        </>
    );
};

export default QuoteForm;