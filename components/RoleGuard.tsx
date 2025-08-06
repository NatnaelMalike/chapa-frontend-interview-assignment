"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

type Props = {
  allowedRoles: ("user" | "admin" | "super-admin")[];
  children: React.ReactNode;
};

export const RouteGuard = ({ allowedRoles, children }: Props) => {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user || !allowedRoles.includes(user.role)) {
      router.replace("/login");
    }
  }, [user, allowedRoles, router]);

  if (!user || !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
};

