'use client'

import { ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, Shield, Crown } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useAuth } from '@/hooks/use-auth';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { user } = useAuthStore();
  const {logout} = useAuth()

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'user': return <User className="h-4 w-4" />;
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'super_admin': return <Crown className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'user': return 'default';
      case 'admin': return 'secondary';
      case 'super_admin': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Chapa Dashboard</h1>
              <Badge variant={getRoleColor(user?.role || 'user')} className="flex items-center gap-1">
                {getRoleIcon(user?.role || 'user')}
                {user?.role?.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        </div>
        {children}
      </main>
    </div>
  );
}
