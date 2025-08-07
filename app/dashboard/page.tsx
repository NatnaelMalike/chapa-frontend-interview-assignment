"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, Shield, Crown } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useAuth } from "@/hooks/use-auth";
import { RouteGuard } from "@/components/RoleGuard";
import { Transaction } from "@/types/transaction";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export default function DashboardLayout({
  children,
  title,
}: DashboardLayoutProps) {
  const { user } = useAuthStore();
  const { logout } = useAuth();

  // Mock wallet balance and transactions if not present
  const walletBalance = user?.walletBalance ?? 1500.75;
  const mockTransactions: Transaction[] = user?.transactions ?? [
    {
      status: "Success",
      ref_id: "TXN123456",
      type: "Deposit",
      created_at: new Date("2025-08-01T10:00:00Z"),
      currency: "USD",
      amount: "500.00",
      charge: "0.00",
      trans_id: "1",
      payment_method: "Card",
      customer: {
        id: 1,
        email: "customer1@example.com",
        first_name: "John",
        last_name: "Doe",
        mobile: "1234567890",
      },
    },
    {
      status: "Success",
      ref_id: "TXN654321",
      type: "Withdrawal",
      created_at: new Date("2025-08-03T14:30:00Z"),
      currency: "USD",
      amount: "200.00",
      charge: "2.00",
      trans_id: "2",
      payment_method: "Bank",
      customer: {
        id: 1,
        email: "customer1@example.com",
        first_name: "John",
        last_name: "Doe",
        mobile: "1234567890",
      },
    },
  ];

  // Transaction form state
  const [amount, setAmount] = useState("");
  const [txType, setTxType] = useState("Deposit");
  const [txLoading, setTxLoading] = useState(false);
  const [txSuccess, setTxSuccess] = useState<string | null>(null);

  const handleTxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTxLoading(true);
  
    try {
      const response = await fetch("/api/transactions/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 100,
          currency: "ETB",
          email: "example@chapa.com",
          first_name: "John",
          last_name: "Doe",
          phone_number: "0912345678",
          tx_ref: `tx-${Date.now()}`,
          callback_url: "https://direct-cardinal-nationally.ngrok-free.app/api/payment/callback",
          return_url: "https://direct-cardinal-nationally.ngrok-free.app/thank-you",
        }),
      });
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data?.message || 'Transaction failed.');
      }
  
      // Optional: redirect to the checkout page Chapa returns
      if (data?.data?.checkout_url) {
        window.location.href = data.data.checkout_url;
      } else {
        console.log('No checkout URL found.');
      }
  
    } catch (err: any) {
      console.error('Transaction error:', err.message);
      alert(err.message);
    } finally {
      setTxLoading(false);
    }
  };
  

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "user":
        return <User className="h-4 w-4" />;
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "super_admin":
        return <Crown className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "user":
        return "default";
      case "admin":
        return "secondary";
      case "super_admin":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <RouteGuard allowedRole={"user"}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Chapa Dashboard
                </h1>
                <Badge
                  variant={getRoleColor(user?.role || "user")}
                  className="flex items-center gap-1"
                >
                  {getRoleIcon(user?.role || "user")}
                  {user?.role?.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user?.username}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Wallet Balance */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Wallet Balance</h2>
              <div className="text-3xl font-bold text-green-600">
                $
                {walletBalance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
            {/* Transaction Form */}
            <form
              onSubmit={handleTxSubmit}
              className="bg-white p-4 rounded shadow flex flex-col md:flex-row gap-2 items-end"
            >
              <div>
                <label className="block text-sm font-medium">Amount</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border rounded px-2 py-1 w-32"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Type</label>
                <select
                  value={txType}
                  onChange={(e) => setTxType(e.target.value)}
                  className="border rounded px-2 py-1 w-32"
                >
                  <option value="Deposit">Deposit</option>
                  <option value="Withdrawal">Withdrawal</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={txLoading}
              >
                {txLoading ? "Submitting..." : "Submit"}
              </button>
              {txSuccess && (
                <span className="text-green-600 ml-2">{txSuccess}</span>
              )}
            </form>
          </div>

          {/* Recent Transactions */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Ref ID</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTransactions.map((tx) => (
                    <tr key={tx.trans_id}>
                      <td className="border px-4 py-2">
                        {new Date(tx.created_at).toLocaleString()}
                      </td>
                      <td className="border px-4 py-2">{tx.type}</td>
                      <td className="border px-4 py-2">
                        {tx.currency} {tx.amount}
                      </td>
                      <td className="border px-4 py-2">{tx.status}</td>
                      <td className="border px-4 py-2">{tx.ref_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Page Title */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          </div>
          {children}
        </main>
      </div>
    </RouteGuard>
  );
}
