import { ReactNode } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  authToken: string;
  productInfo: any;
  passengerIdentity: string;
  setPassengerIdentity: (identity: string) => void;
  setIsAuthenticated: (auth: boolean) => void;
  setAuthToken: (token: string) => void;
  setProductInfo: (info: any) => void;
};

type AuthProviderProps = {
  children: ReactNode;
};
