"use client";

import { LoginForm } from "@/components/forms/login-form";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") router.push("/admin-dashboard");
      else if (user.role === "super-admin") router.push("super-admin");
      else router.push("/dashboard");
    }
  }, [user, router]);
  return (
    <div className="flex p-4  h-screen items-center justify-center">
      <LoginForm />
    </div>
  );
}
