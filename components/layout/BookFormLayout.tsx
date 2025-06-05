import ScrollToTop from "@/lib/ScrollToTop";
import React from "react";

import { ReactNode } from "react";

interface BookingFormLayoutProps {
    children: ReactNode;
}

const BookingFormLayout = ({ children }: BookingFormLayoutProps) => {
    return (
        <div className="bg-white rounded-[12px] pb-[70px] ">
            <ScrollToTop />
            <div className="md:w-[710px] mx-auto  ">{children}</div>
        </div>
    );
};

export default BookingFormLayout;
