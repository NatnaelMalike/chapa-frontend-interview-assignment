"use client";

import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import { transactions } from "@/data/transactions";
import { RoleGuard } from "@/components/role-guard";
import { PaymentForm } from "@/components/forms/payment-form";
import { TransactionHistory } from "@/components/transaction-history";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default function UserDashboard() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  // Get user's transactions for stats
  const userTransactions = transactions.filter(
    (transaction) => transaction.customer.email === user?.email
  );

  // Calculate total transactions
  const totalTransactions = userTransactions.length;
  const successfulTransactions = userTransactions.filter(
    (t) => t.status === "success"
  );
  const totalAmount = successfulTransactions.reduce(
    (sum, t) => sum + parseFloat(t.amount),
    0
  );

  return (
    <RoleGuard allowedRole="user">
      <div className="min-h-screen bg-background">
        {/* Sidebar */}
        <DashboardSidebar user={user} onLogout={handleLogout} />

        {/* Main Content */}
        <div className="lg:pl-80">
          <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.username}!
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Wallet Balance
                  </CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {user?.walletBalance?.toFixed(2)} ETB
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Transactions
                  </CardTitle>
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalTransactions}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalAmount.toFixed(2)} ETB processed
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Transaction Form and History */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Transaction Form */}
              <PaymentForm />

              {/* Transaction History */}
              <TransactionHistory userEmail={user?.email} />
            </div>
            
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
