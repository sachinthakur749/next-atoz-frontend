"use server";

import axios from "axios";
import { cookies } from "next/headers";

export async function getRequest(url: string) {
  const cookieStore = cookies();
  let accessToken = (await cookieStore).get("api_token")?.value;

  if (!accessToken) {
    accessToken = process.env.NEXT_PUBLIC_API_TOKEN;
  }

  if (!accessToken) {
    throw new Error("No access token available");
  }

  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

  if (!apiEndpoint) {
    throw new Error("API_ENDPOINT is not defined in environment variables");
  }

  try {
    const response = await fetch(`${apiEndpoint}/${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      next: { revalidate: 60 }, // Revalidate cache every 60 seconds
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in Get request:", error);
    throw error;
  }
}

// export async function postRequest(url: string, data: Record<string, any>) {
//   const cookieStore = cookies();
//   let accessToken = (await cookieStore).get("api_token")?.value;

//   if (!accessToken) {
//     accessToken = process.env.NEXT_PUBLIC_API_TOKEN;
//   }

//   if (!accessToken) {
//     throw new Error("No access token available");
//   }
//   const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

//   if (!apiEndpoint) {
//     throw new Error("API_ENDPOINT is not defined in environment variables");
//   }

//   const formData = new FormData();
//   Object.entries(data).forEach(([key, value]) => {
//     if (key === "via") {
//       const viaArray = Array.isArray(data[key]) ? data[key] : [data[key]];
//       viaArray.forEach((item, index) => {
//         for (const nestedKey in item) {
//           formData.append(`${key}[${index}][${nestedKey}]`, item[nestedKey]);
//         }
//       });
//     } else if (typeof data[key] === "object" && data[key] !== null) {
//       for (const nestedKey in data[key]) {
//         formData.append(`${key}[${nestedKey}]`, data[key][nestedKey]);
//       }
//     } else {
//       formData.append(key, value);
//     }
//   });

//   try {
//     const response = await fetch(`${apiEndpoint}/${url}`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//       body: formData,
//       next: { revalidate: 60 },
//     });

//     const data = await response.json();
//     if (!response.ok) {
//       console.log("eee", data);
//       return {
//         status: 422,
//         response: {
//           ...data,
//           code: data?.data?.code || "",
//           no_rate: data?.data?.no_rate || "",
//         },
//       };
//     }

//     return { status: response.status, response: data };
//   } catch (error) {
//     console.error("Error in multipart POST request:", error);

//     throw error;
//   }
// }
