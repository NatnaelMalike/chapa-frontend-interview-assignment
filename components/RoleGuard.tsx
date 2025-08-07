"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

type Props = {
  allowedRole: "user" | "admin" | "super-admin";
  children: React.ReactNode;
};

export const RouteGuard = ({ allowedRole, children }: Props) => {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    console.log("RouteGuard useEffect:", { user, allowedRole }); // Debug log
    if (!user || user.role !== allowedRole) {
      router.replace("/");
    }
  }, [user, allowedRole, router]);

  if (!user) return <div>Loading...</div>;
  if (user.role !== allowedRole) return null;

  return <>{children}</>;
};