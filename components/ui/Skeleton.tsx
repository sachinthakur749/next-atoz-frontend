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