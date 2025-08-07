'use client';
import React, { useState, useEffect } from "react";
import { RouteGuard } from "@/components/RoleGuard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

// Mocked users and admins
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
const initialAdmins = [
  { id: 10, name: "Super Admin", email: "super@admin.com" },
  { id: 11, name: "Admin User", email: "admin@admin.com" },
];

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState(initialUsers);
  const [admins, setAdmins] = useState(initialAdmins);
  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "" });
  const [transferStatus, setTransferStatus] = useState<string | null>(null);
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferForm, setTransferForm] = useState({
    account_number: "",
    amount: "",
    bank_code: ""
  });
  const [transfers, setTransfers] = useState([]);
  const [transfersLoading, setTransfersLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [verifyTxRef, setVerifyTxRef] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  
  const { logout } = useAuth();
  const router = useRouter();

  // Toggle user active status
  const toggleUser = (id: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
    );
  };

  // Add admin (mocked)
  const addAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdmin.name && newAdmin.email) {
      setAdmins((prev) => [...prev, { id: Date.now(), ...newAdmin }]);
      setNewAdmin({ name: "", email: "" });
    }
  };
  // Remove admin (mocked)
  const removeAdmin = (id: number) => {
    setAdmins((prev) => prev.filter((a) => a.id !== id));
  };

  // Fetch supported banks
  useEffect(() => {
    setLoadingBanks(true);
    fetch("/api/banks", {
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setBanks(data.data || []);
        setLoadingBanks(false);
      })
      .catch(() => setLoadingBanks(false));
  }, []);

  // Fetch transfers
  const fetchTransfers = async (page = 1) => {
    setTransfersLoading(true);
    try {
      const response = await fetch(`/api/transfers?page=${page}&per_page=10`);
      const data = await response.json();
      
      if (response.ok) {
        setTransfers(data.data || []);
        setCurrentPage(data.meta?.current_page || 1);
        setTotalPages(data.meta?.last_page || 1);
      }
    } catch (error) {
      console.error('Failed to fetch transfers:', error);
    } finally {
      setTransfersLoading(false);
    }
  };

  // Load transfers on component mount
  useEffect(() => {
    fetchTransfers();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Generate random reference
  const generateReference = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `TXN-${timestamp}-${random}`.toUpperCase();
  };

  // Handle transfer form submission
  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransferLoading(true);
    setTransferStatus(null);

    // Generate unique reference for this transfer
    const generatedReference = generateReference();

    try {
      const response = await fetch('/api/initiate-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_number: transferForm.account_number,
          amount: parseFloat(transferForm.amount),
          bank_code: transferForm.bank_code,
          reference: generatedReference,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTransferStatus(`Transfer initiated successfully! Status: ${data.status || 'Pending'}`);
        setTransferForm({ account_number: "", amount: "", bank_code: "" });
        // Refresh transfers list
        fetchTransfers(currentPage);
      } else {
        setTransferStatus(`Transfer failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      setTransferStatus(`Transfer failed: ${(error as Error).message}`);
    } finally {
      setTransferLoading(false);
    }
  };

  // Handle transfer verification
  const handleVerifyTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyTxRef.trim()) return;

    setVerifyLoading(true);
    setVerificationResult(null);

    try {
      const response = await fetch(`/api/transfers/verify/${verifyTxRef}`);
      const data = await response.json();

      if (response.ok) {
        setVerificationResult(data);
      } else {
        setVerificationResult({ error: data.message || 'Verification failed' });
      }
    } catch (error) {
      setVerificationResult({ error: (error as Error).message });
    } finally {
      setVerifyLoading(false);
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchTransfers(page);
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
      case 'cancelled':
      case 'failed/cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  // System-wide stats
  const totalPayments = users.reduce((sum, u) => sum + u.totalPayments, 0);
  const activeUsers = users.filter((u) => u.active).length;

  return (
    <RouteGuard allowedRole="super-admin">
      <div className="max-w-5xl mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {/* System-wide stats */}
        <div className="mb-8 flex gap-8">
          <div className="bg-white rounded shadow p-4">
            <div className="text-lg font-semibold">Total Payments</div>
            <div className="text-2xl font-bold text-green-600">
              ${totalPayments.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="text-lg font-semibold">Active Users</div>
            <div className="text-2xl font-bold text-blue-600">
              {activeUsers}
            </div>
          </div>
        </div>

        {/* Admins management */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Admins</h2>
          <form onSubmit={addAdmin} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Name"
              value={newAdmin.name}
              onChange={(e) =>
                setNewAdmin((a) => ({ ...a, name: e.target.value }))
              }
              className="border rounded px-2 py-1"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newAdmin.email}
              onChange={(e) =>
                setNewAdmin((a) => ({ ...a, email: e.target.value }))
              }
              className="border rounded px-2 py-1"
              required
            />
            <Button type="submit" size="sm">
              Add Admin
            </Button>
          </form>
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Remove</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td className="border px-4 py-2">{admin.name}</td>
                  <td className="border px-4 py-2">{admin.email}</td>
                  <td className="border px-4 py-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeAdmin(admin.id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Users Table (inherits admin) */}
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

        {/* Payments Summary (inherits admin) */}
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

        {/* Supported Banks (inherits admin) */}
        <div className="mb-8">
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

        {/* Initiate Transfer */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Initiate Transfer</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTransferSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="account_number">Account Number</Label>
                    <Input
                      id="account_number"
                      type="text"
                      placeholder="Enter account number"
                      value={transferForm.account_number}
                      onChange={(e) =>
                        setTransferForm(prev => ({
                          ...prev,
                          account_number: e.target.value
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="Enter amount"
                      value={transferForm.amount}
                      onChange={(e) =>
                        setTransferForm(prev => ({
                          ...prev,
                          amount: e.target.value
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank_code">Bank</Label>
                    <select
                      id="bank_code"
                      value={transferForm.bank_code}
                      onChange={(e) =>
                        setTransferForm(prev => ({
                          ...prev,
                          bank_code: e.target.value
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Bank</option>
                      {banks.map((bank: any) => (
                        <option key={bank.code} value={bank.id}>
                          {bank.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={transferLoading || loadingBanks}
                  className="w-full md:w-auto"
                >
                  {transferLoading ? "Processing Transfer..." : "Initiate Transfer"}
                </Button>
              </form>
              {transferStatus && (
                <div className={`mt-4 p-3 rounded ${
                  transferStatus.includes('successfully') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {transferStatus}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Transfer Verification */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Verify Transfer</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerifyTransfer} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter transaction reference (tx_ref)"
                    value={verifyTxRef}
                    onChange={(e) => setVerifyTxRef(e.target.value)}
                    className="flex-1"
                    required
                  />
                  <Button type="submit" disabled={verifyLoading}>
                    {verifyLoading ? "Verifying..." : "Verify"}
                  </Button>
                </div>
              </form>
              
              {verificationResult && (
                <div className="mt-4 p-4 border rounded-lg">
                  {verificationResult.error ? (
                    <div className="text-red-600">
                      <strong>Error:</strong> {verificationResult.error}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>Status:</strong> 
                          <Badge 
                            variant={getStatusBadgeVariant(verificationResult.data?.status)} 
                            className="ml-2"
                          >
                            {verificationResult.data?.status || 'Unknown'}
                          </Badge>
                        </div>
                        <div><strong>Amount:</strong> {verificationResult.data?.amount} {verificationResult.data?.currency}</div>
                        <div><strong>Account:</strong> {verificationResult.data?.account_number}</div>
                        <div><strong>Bank:</strong> {verificationResult.data?.bank_name}</div>
                        <div><strong>Reference:</strong> {verificationResult.data?.chapa_reference}</div>
                        <div><strong>Created:</strong> {new Date(verificationResult.data?.created_at).toLocaleString()}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Transfers List */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Transfer History</CardTitle>
                <Button 
                  onClick={() => fetchTransfers(currentPage)} 
                  disabled={transfersLoading}
                  size="sm"
                  variant="outline"
                >
                  {transfersLoading ? "Loading..." : "Refresh"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {transfersLoading ? (
                <div className="text-center py-4">Loading transfers...</div>
              ) : transfers.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No transfers found</div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Reference</th>
                          <th className="px-4 py-2 text-left">Account</th>
                          <th className="px-4 py-2 text-left">Bank</th>
                          <th className="px-4 py-2 text-left">Amount</th>
                          <th className="px-4 py-2 text-left">Status</th>
                          <th className="px-4 py-2 text-left">Date</th>
                          <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transfers.map((transfer: any) => (
                          <tr key={transfer.chapa_reference} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-2 font-mono text-sm">
                              {transfer.chapa_reference}
                            </td>
                            <td className="px-4 py-2">
                              <div>
                                <div className="font-medium">{transfer.account_name}</div>
                                <div className="text-sm text-gray-500">{transfer.account_number}</div>
                              </div>
                            </td>
                            <td className="px-4 py-2">{transfer.bank_name}</td>
                            <td className="px-4 py-2">
                              {transfer.amount} {transfer.currency}
                            </td>
                            <td className="px-4 py-2">
                              <Badge variant={getStatusBadgeVariant(transfer.status)}>
                                {transfer.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {new Date(transfer.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setVerifyTxRef(transfer.chapa_reference);
                                  handleVerifyTransfer({ preventDefault: () => {} } as React.FormEvent);
                                }}
                                disabled={verifyLoading}
                              >
                                Verify
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      
                      <span className="text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </RouteGuard>
  );
};

export default SuperAdminDashboard;
