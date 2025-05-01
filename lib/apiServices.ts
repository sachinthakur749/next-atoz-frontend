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

export const dataFetcher = async (url, options = {}) => {
  let accessToken = localStorage.getItem("passenger_api_token");
  const selectedLanguage = localStorage.getItem("locale") || "en";
  if (!accessToken) {
    accessToken = `${process.env.NEXT_PUBLIC_API_TOKEN}`;
  }

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${url}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        language: selectedLanguage,
        ...options.headers,
      },
      ...options,
    }
  );
  return response.data;
};
