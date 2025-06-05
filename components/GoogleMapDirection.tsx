"use client";

import React, { useEffect, useState } from "react";
import {
    useJsApiLoader,
    GoogleMap,
    DirectionsRenderer,
    Marker,
    Libraries,
} from "@react-google-maps/api";

const center = { lat: 48.8584, lng: 2.2945 };

const viaPoint = {
    lat: 51.248562,
    lng: 0.63008,
};
const containerStyle = {
    width: "100%",
    height: "300px",
};
const libraries: Libraries = ['places'];

type ViaPoint = {
    lat: number;
    lng: number;
};

type GoogleMapDirectionProps = {
    from_lat: number | undefined;
    from_lng: number | undefined;
    to_lat: number | undefined;
    to_lng: number | undefined;
    via?: ViaPoint[];
    routes?: any;
};

const GoogleMapDirection = ({
    from_lat,
    from_lng,
    to_lat,
    to_lng,
    via,
    routes,
}: GoogleMapDirectionProps) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
        libraries: libraries,
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
    const [distance, setDistance] = useState<string | null>(null);
    const [duration, setDuration] = useState<string | null>(null);

    useEffect(() => {
        const calculateRoute = async () => {
            const directionsService = new window.google.maps.DirectionsService();

            const results = await directionsService.route({
                origin: { lat: from_lat ?? 0, lng: from_lng ?? 0 },
                destination: { lat: to_lat ?? 0, lng: to_lng ?? 0 },
                travelMode: window.google.maps.TravelMode.DRIVING,
                waypoints: via
                    ? via?.map((point) => ({
                        location: new google.maps.LatLng(point.lat, point?.lng),
                    }))
                    : [],
            });

            setDirectionsResponse(results);
            setDistance(results.routes?.[0]?.legs?.[0]?.distance?.text ?? null);
            setDuration(results.routes?.[0]?.legs?.[0]?.duration?.text ?? null);
        };

        if (isLoaded) {
            calculateRoute();
        }
    }, [isLoaded]);

    useEffect(() => {
        if (isLoaded && map && routes) {
            const bounds = new window.google.maps.LatLngBounds();
            bounds.extend(routes?.bounds?.northeast);
            bounds.extend(routes?.bounds?.southwest);
            map.fitBounds(bounds);
            var decodedPoints = google?.maps?.geometry?.encoding?.decodePath(
                routes?.points
            );
            if (decodedPoints?.length > 0) {
                const flightPath = new google.maps.Polyline({
                    path: decodedPoints,
                    geodesic: true,
                    strokeColor: "#FF0000",
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                });
                flightPath.setMap(map);
            }
        }
    }, [isLoaded, map, routes]);

    if (!isLoaded) {
        return <span>Loading...</span>;
    }

    return (
        <div className="w-full h-full flex items-center justify-center rounded-[10px] overflow-hidden ">
            <div className="w-full h-full flex flex-col items-center justify-center gap-[10px]">
                <GoogleMap
                    center={center}
                    zoom={10}
                    mapContainerStyle={containerStyle}
                    options={{
                        zoomControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                    }}
                    onLoad={(map) => setMap(map)}
                >
                    {directionsResponse && (
                        <DirectionsRenderer directions={directionsResponse} />
                    )}
                </GoogleMap>
            </div>
        </div>
    );
};

export default GoogleMapDirection;
