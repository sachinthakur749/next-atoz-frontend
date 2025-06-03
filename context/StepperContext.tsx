"use client";

import { StepperContextType } from "@/types/auth";
import React, { createContext, ReactNode, useContext, useState } from "react";

const StepperContext = createContext<StepperContextType | undefined>(undefined);

export const StepperProvider = ({ children }: { children: ReactNode }) => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [bookingData, setBookingData] = useState<any>(null); // replace `any` with your actual booking data type

    const steps = [
        "Vehicle selection",
        "Passenger details",
        "Payment",
        "Review and confirm",
    ];

    const nextStep = () => {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const goToStep = (step: number) => {
        setCurrentStep(Math.min(Math.max(step, 1), steps.length));
    };

    return (
        <StepperContext.Provider
            value={{
                currentStep,
                nextStep,
                prevStep,
                goToStep,
                steps,
                setBookingData,
                bookingData,
            }}
        >
            {children}
        </StepperContext.Provider>
    );
};

export const useStepper = (): StepperContextType => {
    const context = useContext(StepperContext);
    if (!context) {
        throw new Error("useStepper must be used within a StepperProvider");
    }
    return context;
};
