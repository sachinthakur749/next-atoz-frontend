"use client";
import { useState, useEffect } from "react";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa6";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ServiceItem } from "@/types/auth";


interface FooterProps {
  serviceLists: ServiceItem[];
  locationLists: ServiceItem[];
  fleetLists: ServiceItem[];
  siteInfo: SiteInfoType;
}

const Footer = ({ serviceLists, locationLists, fleetLists, siteInfo }: FooterProps) => {
  const [domainName, setDomainName] = useState("");
  const pathname = usePathname();


  useEffect(() => {
    setDomainName(window.location.hostname);
  }, []);

  const currentYear = new Date().getFullYear();



  if (pathname.includes("iframe")) return null;

  return (
    <div className="bg-black w-full px-[50px] py-[40px]">
      <div className=" ">
        <div className="flex flex-col md:flex-row  justify-between">
          <p className="text-white text-[30px]">{siteInfo?.name}</p>
          <div className=" flex mt-4 md:mt-0  items-center gap-2 ">
            <Link
              target="_blank"
              href={siteInfo?.passenger_android_link || ""}
            >
              <img
                src={"/images/Google_Play.png"}
                height={200}
                alt="google-play"
                className="h-[40px] w-auto object-contain cursor-pointer"
              />
            </Link>
            <Link target="_blank" href={siteInfo?.passenger_ios_link || ""}>
              <img
                src={"/images/app_store.webp"}
                alt="app-store"
                className="h-[40px] w-auto object-contain cursor-pointer "
              />
            </Link>
          </div>
        </div>
        <div className="bg-[#97999eb9] h-[1px] my-3  "></div>

        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-5  ">
          <div>
            <h2 className="text-white text-[17px] font-semibold my-[15px]  ">
              Company
            </h2>
            <Link href="/about-us">
              <p className="text-[#97999e] hover:text-white hover:underline text-[14px] mb-[8px]">
                About Us
              </p>
            </Link>
            <Link href="/our-services">
              <p className="text-[#97999e] hover:text-white hover:underline text-[14px] mb-[8px]">
                Our Service
              </p>
            </Link>
            <Link href="/drive-with-us">
              <p className="text-[#97999e] hover:text-white hover:underline text-[14px] mb-[8px]">
                Drive With Us
              </p>
            </Link>
            <Link href={"/faq"}>
              <p className="text-[#97999e] hover:text-white hover:underline text-[14px] mb-[8px]">
                FAQ&apos;s
              </p>
            </Link>
          </div>

          <div>
            <h2 className="text-white text-[17px] font-semibold my-[15px] ">
              Fleet
            </h2>
            {fleetLists.map((item, ind) => (
              <Link key={ind} href={`/fleet`}>
                <p className="text-[#97999e] hover:text-white hover:underline text-[14px] mb-[8px]">
                  {item?.title}
                </p>
              </Link>
            ))}
          </div>

          <div>
            <h2 className="text-white text-[17px] font-semibold my-[8px] ">
              locations
            </h2>
            {locationLists?.map((item, ind) => (
              <Link key={ind} href={`/locations/${item?.slug}`}>
                <p className="text-[#97999e] hover:text-white hover:underline text-[14px] mb-[8px]">
                  {item.title}
                </p>
              </Link>
            ))}
          </div>

          <div>
            <h2 className="text-white text-[17px] font-semibold my-[8px] ">
              Services
            </h2>
            {serviceLists?.map((item, ind) => (
              <Link key={ind} href={`/our-service/${item?.slug}`}>
                <p className="text-[#97999e] hover:text-white hover:underline text-[14px] mb-[8px]">
                  {item.title}
                </p>
              </Link>
            ))}
          </div>

          <div>
            <h2 className="text-white text-[17px] font-semibold my-[8px] ">
              Contact Us
            </h2>

            {siteInfo?.is_product == 1 && (
              <>
                <p className="text-[#97999e] text-[14px] mb-[8px]">
                  International Phone :{" "}
                  <a
                    href={`tel:${siteInfo?.international_phone}`}
                    className="text-white font-bold"
                  >
                    {siteInfo?.international_phone}
                  </a>{" "}
                </p>
                <p className="text-[#97999e] text-[14px] mb-[8px]">
                  International Address :{" "}
                  <span>{siteInfo?.international_address}</span>{" "}
                </p>
              </>
            )}

            <p className="text-[#97999e] text-[14px] mb-[8px]">
              Phone :{" "}
              <a
                href={`tel:${siteInfo?.phone}`}
                className="text-white font-bold"
              >
                {siteInfo?.phone}
              </a>{" "}
            </p>
            <p className="text-[#97999e] text-[14px] mb-[8px]">
              Address : <span>{siteInfo?.address}</span>{" "}
            </p>
            <p className="text-[#97999e] text-[14px] mb-[8px]">
              Email :{" "}
              <a
                href={`mailto:${siteInfo?.email}`}
                className="text-white break-words font-bold"
              >
                {siteInfo?.email}
              </a>{" "}
            </p>
          </div>
        </div>

        <div className="bg-[#97999eb9] h-[1px] my-3  "></div>

        <div className="flex flex-col gap-4  md:flex-row justify-between">
          <div className="flex md:items-center flex-col gap-4  md:flex-row ">
            <p className=" text-white text-[15px]  ">
              &#169; {currentYear} {siteInfo?.name}
            </p>
            <div className="flex gap-5 items-center">
              <Link href={"/terms-of-services"}>
                <p className="text-[#97999e] hover:text-white hover:underline text-[14px] ">
                  Terms of Services
                </p>
              </Link>
              <Link href={"/privacy-policy"}>
                <p className="text-[#97999e] hover:text-white hover:underline text-[14px] ">
                  Privacy Policy
                </p>
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-end gap-4">
            <div className="flex items-center   gap-4">
              <Link target="_blank" href={siteInfo?.facebook_link || ""}>
                <FaFacebookF className="text-[#97999e] cursor-pointer" />
              </Link>
              <Link target="_blank" href={siteInfo?.google_link || ""}>
                <FaGoogle className="text-[#97999e] cursor-pointer" />
              </Link>
              <Link target="_blank" href={siteInfo?.instagram_link || ""}>
                <BsInstagram className="text-[#97999e] cursor-pointer" />
              </Link>
              <Link target="_blank" href={siteInfo?.linkedin_link || ""}>
                <FaLinkedin className="text-[#97999e] cursor-pointer" />
              </Link>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
