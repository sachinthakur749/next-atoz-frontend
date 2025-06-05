"use client";

import SelectVehicle from '@/components/sections/SelectionVehicle';
import { useStepper } from '@/context/StepperContext';
import React, { useEffect, useState } from 'react'

const page = () => {

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const { nextStep, prevStep, currentStep, steps } = useStepper();
    const [bookingConfirmedData, setBookingConfirmedData] = useState({
        title: null,
        message: null,
        fare: null,
    });
    const [capacity, setCapacity] = useState({
        passenger: 1,
        luggage: 0,
    });

    const sendStepCompleted = (step: number) => {
        window.parent.postMessage({ type: "stepCompleted", step: step }, "*");
    };

    useEffect(() => {
        sendStepCompleted(currentStep);
    }, [currentStep]);


    return (
        <div className="bg-[#e4e6eb] ">
            <div className="p-2  ">
                {currentStep === 1 && (
                    <SelectVehicle setIsLoginModalOpen={setIsLoginModalOpen} />
                )}
                {/* {currentStep === 2 && <AddExtras setCapacity={setCapacity} />}
        {currentStep === 3 && (
          <PaymentMethod
            capacity={capacity}
            setBookingConfirmedData={setBookingConfirmedData}
          />
        )} */}
            </div>
            {/* <LoginModal
        open={isLoginModalOpen}
        handleClose={() => setIsLoginModalOpen(false)}
      /> */}
        </div>
    );
}

export default page