"use client";

import { RoleGuard } from "@/components/role-guard";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {  Building2, Loader2, Users, Activity, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { StatCard } from "@/components/stat-card";
import { useGetBanks } from "@/hooks/useChapaApi";
import { useEffect, useState } from "react";
import { users as mockUsers } from "@/data/users";
import { Switch } from "@/components/ui/switch";
import { transactions } from "@/data/transactions";

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const [users, setUsers] = useState<User[]>(mockUsers.filter(user=> user.role === 'user'));
  const { execute: fetchBanks, data: banks, loading: isLoadingBanks, error } = useGetBanks();
  const router = useRouter();
  useEffect(() => {
    fetchBanks(); 
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  const toggleUserStatus = (userId: number) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, isActive: !user.isActive }
        : user
    ))
      
  }
  const totalPayments = transactions.reduce((sum, tx) => sum + Number(tx.amount), 0)
  const activeUsers = users.filter(u => u.isActive).length
  return (
    <RoleGuard allowedRole="admin">
      <div className="min-h-screen bg-background">
      {/* Sidebar */}
        <DashboardSidebar user={user} onLogout={handleLogout} />
      <div className="lg:pl-80">
      <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
      <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={users.length}
          description="Registered users"
          icon={Users}
          />
        <StatCard
          title="Active Users"
          value={activeUsers}
          description="Currently active"
          icon={Activity}
          trend={{ value: 8.2, isPositive: true }}
          />
        <StatCard
          title="Total Payments"
          value={`${totalPayments.toLocaleString()} ETB`}
          description="All time payments"
          icon={DollarSign}
          />
        <StatCard
          title="Supported Banks"
          value={banks ? banks.length : 0}
          description="Available banks"
          icon={Building2}
          />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                  
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      {(user.walletBalance ?? 0).toLocaleString()} ETB
                    </span>
                    <Switch
                      checked={user.isActive}
                      onCheckedChange={() => toggleUserStatus(user.id)}
                      />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Supported Banks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Supported Banks</CardTitle>
              <CardDescription>Banks integrated with Chapa API</CardDescription>
            </div>
            <Button variant="outline" onClick={fetchBanks} disabled={isLoadingBanks}>
              {isLoadingBanks && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {isLoadingBanks ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 border rounded-lg animate-pulse">
                    <div className="w-10 h-10 bg-muted rounded-lg" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {banks?.map((bank) => (
                  <div key={bank.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{bank.name}</p>
                      <p className="text-sm text-muted-foreground">Code: {bank.code}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
      </div>
      </div>
                    </div>
    </RoleGuard>
  );
}
