"use client";

import { listenToGlobalData } from "@/firebase/firebaseServices";
import { Autocomplete, useLoadScript, Libraries } from "@react-google-maps/api";
import { DocumentData } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { SetStateAction, useEffect, useRef, useState } from "react";


const libraries: Libraries = ['places'];


type AutoCompleteInputProps = {
    go: string;
    placeholder?: string;
    setFormData: (callback: (prevState: any) => any) => void;
    required?: boolean;
    getLatLng: (lat: number | null, lng: number | null) => void;
};

export default function AutoCompleteInput({
    go,
    placeholder,
    setFormData,
    required,
    getLatLng,
}: AutoCompleteInputProps) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
        libraries: libraries,
    });
    const t = useTranslations();
    const [inputValue, setInputValue] = useState("");
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
    const [globalData, setGlobalData] = useState<DocumentData | null>(null);

    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    //   const {
    //     data: globalData = [],
    //     isLoading,
    //     error,
    //   } = useQuery({
    //     queryKey: ["accessCountries"],
    //     queryFn: fetchGlobalData,
    //     cacheTime: 1 * 60 * 1000,
    //     staleTime: 0,
    //     refetchOnWindowFocus: false,
    //   });

    useEffect(() => {
        const unsubscribe = listenToGlobalData((data) => {
            setGlobalData(data);
        });
        return () => unsubscribe?.();
    }, []);



    const getCountryRestrictions = () => {
        if (!globalData?.access_countries) return undefined;
        let countries = Array.isArray(globalData.access_countries)
            ? globalData.access_countries
            : [globalData.access_countries];

        countries = countries.filter(
            (country) => typeof country === "string" && country.length > 0
        );

        return countries.length > 0 ? countries : undefined;
    };

    useEffect(() => {
        if (inputValue && lat !== null && lng !== null) {
            getLatLng(lat, lng);

            if (go === "from") {
                setFormData((prevState) => ({
                    ...prevState,
                    from_location: inputValue,
                    from_lat: lat,
                    from_lng: lng,
                }));
            } else if (go === "to") {
                setFormData((prevState) => ({
                    ...prevState,
                    to_location: inputValue,
                    to_lat: lat,
                    to_lng: lng,
                }));
            } else if (go.includes("via")) {
                const viaIndex = getViaIndex(go);
                setFormData((prevState) => {
                    const newVia = Array.isArray(prevState.via) ? [...prevState.via] : [];
                    newVia[viaIndex] = {
                        location: inputValue,
                        lat: lat,
                        lng: lng,
                    };
                    return {
                        ...prevState,
                        via: newVia,
                    };
                });
            }
        } else {
            // If input is empty, reset lat and lng
            // getLatLng(null, null);
            updateFormData(null, null);
        }
    }, [inputValue, lat, lng]);

    const getViaIndex = (goString: string) => {
        const match = goString.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    };

    const updateFormData = (newLat: number | null, newLng: number | null) => {
        if (go === "from") {
            setFormData((prevState) => ({
                ...prevState,
                from_location: inputValue || null,
                from_lat: newLat,
                from_lng: newLng,
            }));
        } else if (go === "to") {
            setFormData((prevState) => ({
                ...prevState,
                to_location: inputValue || null,
                to_lat: newLat,
                to_lng: newLng,
            }));
        } else if (go.includes("via")) {
            const viaIndex = getViaIndex(go);
            setFormData((prevState) => {
                const newVia = Array.isArray(prevState.via) ? [...prevState.via] : [];
                newVia[viaIndex] = {
                    location: inputValue || null,
                    lat: newLat,
                    lng: newLng,
                };
                return {
                    ...prevState,
                    via: newVia,
                };
            });
        }
    };

    const formatAddress = (name: string | undefined, formattedAddress: string | undefined) => {
        if (!formattedAddress) return
        if (!formattedAddress.includes(name ?? "")) {
            return `${name}, ${formattedAddress}`;
        }
        return formattedAddress;
    };

    const handlePlaceSelect = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place.geometry && place.geometry.location) {
                setLat(place.geometry.location.lat());
                setLng(place.geometry.location.lng());
                setSelectedPlace(place);
                const updatedAdd = formatAddress(place?.name, place?.formatted_address);
                setInputValue(updatedAdd ?? "");
            }
        }
    };

    const handleInputChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setInputValue(e.target.value);
        if (selectedPlace) {
            setSelectedPlace(null);
            setLat(null);
            setLng(null);
        }
    };

    const handleBlur = () => {
        if (!selectedPlace) {
            setInputValue("");
            setLat(null);
            setLng(null);
            updateFormData(null, null);
        }
    };

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>{t("loading")}...</div>;

    const countryRestrictions = getCountryRestrictions();

    return (
        <Autocomplete
            onLoad={(autocomplete) => {
                autocompleteRef.current = autocomplete;
            }}
            onPlaceChanged={handlePlaceSelect}
            options={{
                componentRestrictions: countryRestrictions
                    ? {
                        country: countryRestrictions,
                    }
                    : undefined,
            }}
            className="flex-1"
        >
            <input
                type="text"
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required={required}
                className="w-full bg-transparent border-none outline-none placeholder:text-[#9FA6B2]"
            />
        </Autocomplete>
    );
}
