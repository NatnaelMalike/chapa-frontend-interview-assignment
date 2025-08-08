"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { transactions } from "@/data/transactions";

interface TransactionHistoryProps {
  userEmail?: string;
}

export function TransactionHistory({ userEmail }: TransactionHistoryProps) {
  // Get user's transactions
  const userTransactions = userEmail 
    ? transactions.filter((transaction) => transaction.customer.email === userEmail)
    : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {userTransactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No transactions found
            </p>
          ) : (
            userTransactions.map((transaction) => (
              <div
                key={transaction.ref_id}
                className="flex justify-between items-center p-3 border border-border rounded-lg"
              >
                <div>
                  <p className="font-medium">{transaction.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.ref_id}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{transaction.amount} ETB</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                      transaction.status
                    )}`}
                  >
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}