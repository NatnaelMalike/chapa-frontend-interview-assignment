"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { LoadingIndicator } from "./loading-indicator";
import { Button } from "./ui/button";
import { AlertTriangle, Home, LogOut } from "lucide-react";

interface RoleGuardProps {
  children: ReactNode;
  allowedRole: "user" | "admin" | "superadmin";
}

export function RoleGuard({ children, allowedRole }: RoleGuardProps) {
  const { user, loading, logout } = useAuthStore();
  const router = useRouter();

  // Show loading while checking auth
  if (loading) {
    return (
      <LoadingIndicator 
        message="Checking authentication..." 
        size="lg" 
        fullScreen 
      />
    );
  }

  // Not authenticated - redirect to login
  if (!user) {
    router.replace("/");
    return (
      <LoadingIndicator 
        message="Redirecting to login..." 
        size="lg" 
        fullScreen 
      />
    );
  }

  // Wrong role - show access denied
  if (user.role !== allowedRole) {
    const handleGoHome = () => {
      // Redirect to appropriate dashboard based on user's actual role
      switch (user.role) {
        case "admin":
          router.replace("/admin");
          break;
        case "superadmin":
          router.replace("/superadmin");
          break;
        case "user":
          router.replace("/dashboard");
          break;
        default:
          router.replace("/");
      }
    };

    const handleLogout = async () => {
      await logout();
      router.replace("/");
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-destructive/10 rounded-full">
              <AlertTriangle className="w-12 h-12 text-destructive" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Access Denied
            </h1>
            <p className="text-muted-foreground">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-muted-foreground">
              Required role: <span className="font-semibold text-primary">{allowedRole}</span>
              <br />
              Your role: <span className="font-semibold text-foreground">{user.role}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleGoHome} className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go to My Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Correct role - render children
  return <>{children}</>;
}