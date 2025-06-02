import { getRequest } from '@/lib/apiServices'
import React from 'react'
import FleetSlider from '../FleetSlider'

const FleetSection = async () => {
    const fleetList = await getRequest('content/template?type=fleet')


    return (
        <div className=" w-full flex justify-center py-[20px] md:py-[50px]">
            <div className="">
                <h2 className="text-center text-[33px] font-bold text-titleColor mb-[20px]">
                    Vehicle Types
                </h2>
                <div>
                    <FleetSlider fleetsListData={fleetList?.data} />
                </div>
            </div>
        </div>
    )
}

export default FleetSection