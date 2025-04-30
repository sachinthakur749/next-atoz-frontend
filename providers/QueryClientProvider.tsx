"use client";

import { AuthProviderProps } from "@/types/auth";
import {
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";

export function QueryClientProvider({ children }: AuthProviderProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ReactQueryClientProvider client={queryClient}>
      {children}
    </ReactQueryClientProvider>
  );
}
