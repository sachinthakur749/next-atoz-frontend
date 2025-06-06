"use client";

type PostRequestResponse = {
  status?: number;
  title?: string;
  message?: string;
  response: {
    data?: any;
    code?: string;
    no_rate?: string;
    [key: string]: any;
  };
};

export async function postRequest(
  url: string,
  data: Record<string, any>
): Promise<PostRequestResponse> {
  let accessToken: string | null = null;

  if (typeof window !== "undefined") {
    accessToken =
      localStorage.getItem("api_token") ||
      process.env.NEXT_PUBLIC_API_TOKEN ||
      null;
  }

  if (!accessToken) {
    throw new Error("No access token found in localStorage");
  }

  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

  if (!apiEndpoint) {
    throw new Error("API endpoint is not defined in environment variables");
  }

  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "via" && Array.isArray(value)) {
      value.forEach((item, index) => {
        Object.entries(item).forEach(([nestedKey, nestedValue]) => {
          formData.append(
            `${key}[${index}][${nestedKey}]`,
            String(nestedValue)
          );
        });
      });
    } else if (value && typeof value === "object" && !(value instanceof File)) {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        formData.append(`${key}[${nestedKey}]`, String(nestedValue));
      });
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  try {
    const response = await fetch(`${apiEndpoint}/${url}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const responseData = await response.json();

    const structuredResponse: PostRequestResponse = {
      status: response.status,
      title: responseData?.title,
      message: responseData?.message,
      response: {
        ...responseData,
        code: responseData?.data?.code || "",
        no_rate: responseData?.data?.no_rate || "",
      },
    };

    return structuredResponse;
  } catch (error) {
    console.error("Error in multipart POST request:", error);
    throw new Error("Network or server error occurred.");
  }
}
