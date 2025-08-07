'use client';
import React, { useState, useEffect } from "react";
import { RouteGuard } from "@/components/RoleGuard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// Mocked users data
const initialUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    active: true,
    totalPayments: 1200,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    active: false,
    totalPayments: 800,
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice@example.com",
    active: true,
    totalPayments: 1500,
  },
];

const AdminDashboard = () => {
  const [users, setUsers] = useState(initialUsers);
  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
const { logout } = useAuth();
  // Toggle user active status
  const toggleUser = (id: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
    );
  };

  // Fetch supported banks (mocked API call)
  useEffect(() => {
    setLoadingBanks(true);
    fetch("/api/banks",
      {
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setBanks(data.data || []);
        setLoadingBanks(false);
      })
      .catch(() => setLoadingBanks(false));
  }, []);

  return (
    <RouteGuard allowedRole="admin">
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
        {/* Users Table */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Toggle</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">
                    <Badge variant={user.active ? "default" : "secondary"}>
                      {user.active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="border px-4 py-2">
                    <Button size="sm" onClick={() => toggleUser(user.id)}>
                      {user.active ? "Deactivate" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payments Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">User Payments Summary</h2>
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Total Payments</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">
                    ${user.totalPayments.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Supported Banks */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Supported Banks (NG)</h2>
          {loadingBanks ? (
            <div>Loading banks...</div>
          ) : (
            <ul className="list-disc pl-6">
              {banks.slice(0, 10).map((bank: any) => (
                <li key={bank.id || bank.code}>{bank.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </RouteGuard>
  );
};

export default AdminDashboard;
