'use client'

import { createContext, useContext, useEffect, useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { getRequest } from "@/lib/apiServices";
import { ReactNode } from "react";
import { AuthContextType } from "@/types/auth";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { getItem } = useLocalStorage();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authToken, setAuthToken] = useState("");
    const [user, setUser] = useState();
    const [bookingUser, setBookingUSer] = useState();
    const [productInfo, setProductInfo] = useState();
    const [firebaseReferenceID, setFirebaseReferenceID] = useState();
    const [passengerIdentity, setPassengerIdentity] = useState("");
    const [driverIdentity, setDriverIdentity] = useState("");

    useEffect(() => {
        const accessToken = localStorage.getItem("api_token") || process.env.NEXT_PUBLIC_API_TOKEN
        setAuthToken(accessToken || "")

        const storedUser = localStorage.getItem("passenger_user")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
            setIsAuthenticated(true)
        } else {
            // setUser(null)
            setIsAuthenticated(false)
        }

        const passengerUser = localStorage.getItem("passenger_user")
        if (passengerUser) {
            setPassengerIdentity(JSON.parse(passengerUser).identity)
        }

        const driverUser = localStorage.getItem("driver_user")
        if (driverUser) {
            setDriverIdentity(JSON.parse(driverUser).identity)
        }
    }, [])

    useEffect(() => {
        const getProductInfo = async () => {
            try {
                const res = await getRequest("content/site-info")
                setProductInfo(res?.data)
            } catch (error) {
                console.error("Failed to fetch product info:", error)
            }
        }
        getProductInfo()
    }, [])

    const value: AuthContextType = {
        isAuthenticated,
        authToken,
        productInfo,
        passengerIdentity,
        setPassengerIdentity,
        setProductInfo,
        setIsAuthenticated,
        setAuthToken,
    };

    return (
        <div>
            <AuthContext.Provider
                value={value}
            >
                {children}
            </AuthContext.Provider>
        </div>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
};
