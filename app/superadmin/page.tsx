"use client";

import { RoleGuard } from "@/components/role-guard";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuperAdminDashboard() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <RoleGuard allowedRole="superadmin">
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Super Admin Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Welcome back, {user?.username}!
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          {/* Super Admin Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Super Admin Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Username
                  </label>
                  <p className="text-foreground">{user?.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <p className="text-foreground">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Role
                  </label>
                  <p className="text-foreground capitalize text-primary font-bold">
                    {user?.role}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <p className="text-foreground">
                    {user?.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Super Admin Features Card */}
          <Card>
            <CardHeader>
              <CardTitle>Super Admin Features</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This is the super admin dashboard. Only users with the
                "superadmin" role can access this page. Super admins have the
                highest level of permissions and can manage all aspects of the
                system.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}
