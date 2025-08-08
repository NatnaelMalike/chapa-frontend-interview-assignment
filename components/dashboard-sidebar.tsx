"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  LogOut, 
  User, 
  Menu, 
  X,
  Mail,
  Shield,
  CheckCircle,
  XCircle
} from "lucide-react";


interface DashboardSidebarProps {
  user: User | null;
  onLogout: () => void;
}

export function DashboardSidebar({ user, onLogout }: DashboardSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getInitials = (username: string) => {
    return username
      .split('_')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'user':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between p-4">
      {/* User Profile Section */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {user ? getInitials(user.username) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {user?.username || 'User'}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
        
        {/* Role Badge */}
        <div className="flex items-center justify-between mb-3">
          <Badge 
            variant="outline" 
            className={`${getRoleColor(user?.role || 'user')} capitalize`}
          >
            <Shield className="w-3 h-3 mr-1" />
            {user?.role || 'user'}
          </Badge>
          
          {/* Status Indicator */}
          <div className="flex items-center space-x-1">
            {user?.isActive ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
            <span className="text-xs text-muted-foreground">
              {user?.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-6 border-t border-border justify-end">
        <Button
          variant="outline"
          onClick={onLogout}
          className="w-full flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? (
          <X className="h-4 w-4" />
        ) : (
          <Menu className="h-4 w-4" />
        )}
      </Button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 bg-card border-r border-border">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:hidden
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarContent />
      </div>
    </>
  );
}