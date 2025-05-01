export const HomeWhyChooseSkeleton = () => {
    return (
        <div className="w-full bg-[#fff] flex justify-center pt-[50px] md:py-[50px] animate-pulse">
            <div className="w-width_sm md:w-width_md lg:w-width_lg xl:w-width_xl 2xl:w-width_2xl grid sm:grid-cols-1 md:grid-cols-2 gap-[20px]">
                {/* Left Section (Text Skeleton) */}
                <div className="flex flex-col gap-10 max-md:p-[20px]">
                    <div className="space-y-3">
                        <div className="h-6 bg-gray-300 w-[80%] rounded"></div>
                        <div className="h-6 bg-gray-300 w-[90%] rounded"></div>
                        <div className="h-6 bg-gray-300 w-[90%] rounded"></div>
                        <div className="h-6 bg-gray-300 w-[90%] rounded"></div>
                        <div className="h-6 bg-gray-300 w-[90%] rounded"></div>
                        <div className="h-6 bg-gray-300 w-[70%] rounded"></div>
                    </div>

                    {/* Call to action Skeleton */}
                    <div className="flex items-center gap-10">
                        <div className="bg-gray-300 shadow-md w-[160px] h-[45px] rounded"></div>
                    </div>
                </div>

                {/* Right Section (Image Skeleton) */}
                <div className="w-full h-[200px] md:h-[460px] flex justify-end items-center">
                    <div className="flex w-full md:w-[490px] h-[100%] items-center max-md:py-[20px]">
                        <div className="w-full h-full bg-gray-300 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export const HomeServiceSkeleton = () => {
    return (
        <div className="space-y-3 animate-pulse">
            <div className="w-full h-[116px] bg-gray-300 rounded-md"></div>
            <div className="h-5 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-10 bg-gray-300 rounded w-32 mt-3"></div>
        </div>
    );
};

export const HomeFleetSliderSkeleton = () => {
    return (
        <div className="relative w-full p-[10px] animate-pulse">
            <div className="w-full h-[300px] flex flex-col items-center p-[12px] rounded-sm bg-gray-200">
                <div className="h-[60%] w-full bg-gray-300 rounded"></div>
                <div className="flex flex-col justify-center h-full w-full">
                    <div className="w-full flex flex-col items-center">
                        <div className="mt-[20px] w-[200px] h-6 bg-gray-300 rounded"></div>
                        <div className="flex justify-center gap-4 mt-2">
                            <div className="w-[40px] h-5 bg-gray-300 rounded"></div>
                            <div className="w-[40px] h-5 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};