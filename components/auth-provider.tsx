"use client";

import { useEffect, ReactNode } from "react";
import { useAuthStore } from "@/store/auth-store";
import { LoadingIndicator } from "./loading-indicator";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { fetchMe, isAppLoading } = useAuthStore();

  // Check if user is logged in on app start
  useEffect(() => {
    fetchMe(); 
  }, []);

  // Show loading while checking auth status
  if (isAppLoading) {
    return (
      <LoadingIndicator 
        message="Loading application..." 
        size="lg" 
        fullScreen 
      />
    );
  }

  return <>{children}</>;
}