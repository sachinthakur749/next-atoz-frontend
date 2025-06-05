import { useTranslations } from "next-intl";
import Link from "next/link";


interface FleetCardProps {
    fleetImage: string;
    fleetName: string;
    fleetType: string;
    price: number | string;
    passengers: number;
    luggage: number;
}

const FleetCard = (props: FleetCardProps) => {
    const t = useTranslations();
    const { fleetImage, fleetName, fleetType, price, passengers, luggage } =
        props;

    return (
        <div className=" flex flex-wrap hover:border-primaryOrange cursor-pointer  gap-2 p-[16px] bg-white h-max">
            <div className="flex-1">
                <img
                    className="w-[162px] h-[50px] md:h-[70px]  object-contain "
                    src={`${fleetImage}`}
                    alt="vehicle"
                />
                {/* <p className="text-center text-[#AA8C51] mt-2 font-bold ">
          {fleetName}
        </p> */}
            </div>
            <div className="flex-1 flex flex-col gap-[5px]">
                <p className="text-black/80 font-bold text-[18px] tracking-wide leading-[21.6px] ">
                    {fleetName}
                </p>
                <div className="flex items-center gap-[15px]">
                    <div className="text-nowrap text-black flex items-center flex-nowrap gap-[5px] ">
                        {" "}
                        <img className=" " src="/assets/icons/user-group.png" alt="" />{" "}
                        <span className="font-bold">{passengers}</span>
                    </div>
                    <div className="text-nowrap text-black flex items-center flex-nowrap gap-[5px] ">
                        {" "}
                        <img
                            className=" "
                            src="/assets/icons/hand-bag-01.png"
                            alt=""
                        />{" "}
                        <span className="font-bold">{luggage}</span>
                    </div>
                </div>
                {/* <p className="text-[16px] font-normal text-[#333333] ">
          {t("most_popular")} - {fleetName} {fleetType}
        </p> */}
            </div>
            <div className="flex-1 flex flex-col items-end">
                <p className="md:text-[32px] text-[21px]  font-bold text-[#1d1d1d] leading-[38.4px] ">
                    {price}
                </p>
                <Link
                    href="/terms-of-services"
                    target="_blank"
                    className=" w-max bg-red-400/40 text-red-500 text-[10px] mt-1  px-2 py-[3px] rounded-full"
                >
                    cancellation policy
                </Link>
            </div>
        </div>
    );
};

export default FleetCard;
