"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getRequest } from "@/lib/apiServices";
import { AuthContextType, AuthProviderProps } from "@/types/auth";
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [productInfo, setProductInfo] = useState();
  const [passengerIdentity, setPassengerIdentity] = useState("");

  useEffect(() => {
    const accessToken =
      localStorage.getItem("api_token") || process.env.NEXT_PUBLIC_API_TOKEN;
    setAuthToken(accessToken || "");

    const passengerUser = localStorage.getItem("passenger_user");
    if (passengerUser) {
      setPassengerIdentity(JSON.parse(passengerUser).identity);
    }
  }, []);

  useEffect(() => {
    const getProductInfo = async () => {
      try {
        const res = await getRequest("content/site-info");
        setProductInfo(res?.data);
      } catch (error) {
        console.error("Failed to fetch product info:", error);
      }
    };
    getProductInfo();
  }, []);

  const value = {
    isAuthenticated,
    authToken,
    productInfo,
    passengerIdentity,
    setPassengerIdentity,
    setIsAuthenticated,
    setAuthToken,
    setProductInfo,
  };

  return (
    <div>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </div>
  );
};

export const useAuthContext = () => useContext(AuthContext);
