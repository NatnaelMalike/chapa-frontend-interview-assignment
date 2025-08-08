"use client";

import { useEffect, ReactNode } from "react";
import { useAuthStore } from "@/store/auth-store";
import { LoadingIndicator } from "./loading-indicator";
import { useRouter } from "next/navigation";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { fetchMe, isAppLoading, user } = useAuthStore();
  const router = useRouter();

  // Check if user is logged in on app start
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  // Redirect based on user role after auth check
  useEffect(() => {
    if (!isAppLoading && user) {
      if (user.role === "admin") {
        router.replace("/admin");
      } else if (user.role === "superadmin") {
        router.replace("/superadmin");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [isAppLoading, user, router]);

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