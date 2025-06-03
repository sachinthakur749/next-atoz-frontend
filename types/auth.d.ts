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

export type StepperContextType = {
  currentStep: number;
  bookingData: any;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  setBookingData: (data: any) => void;
  steps: string[];
};

type AuthProviderProps = {
  children: ReactNode;
};

type CmsGlobalType = ServiceItem[];

interface ServiceItem {
  slice(arg0: number, arg1: number): unknown;
  length: number;
  title: string;
  text_1: string;
  text_2: string | null;
  text_3: string | null;
  text_4: string | null;
  text_5: string | null;
  text_6: string | null;
  text_7: string | null;
  text_8: string | null;
  text_9: string | null;
  text_download_app: string | null;
  seo_title: string | null;
  seo_keywords: string | null;
  seo_description: string | null;
  slug: string;
  passenger: number;
  luggage: number;
  baby_seat: number;
  image_1_link: string;
  image_2_link: string;
  image_3_link: string;
  image_4_link: string;
  image_5_link: string;
  image_6_link: string;
  image_7_link: string;
  altTag_1: string | null;
  altTag_2: string | null;
  altTag_3: string | null;
  altTag_4: string | null;
  altTag_5: string | null;
  altTag_6: string | null;
  altTag_7: string | null;
}
