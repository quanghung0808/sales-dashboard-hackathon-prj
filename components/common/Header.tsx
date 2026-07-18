'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useThemeStore } from '@/hooks/useThemeStore';
import { useNotificationStore } from '@/hooks/useNotificationStore';
import { UserRole } from '@/types';
import {
  Search,
  Moon,
  Sun,
  Bell,
  Sparkles,
  UserCheck,
  Shield,
  Briefcase,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlobalSearchModal } from '@/components/common/GlobalSearch';
import { NotificationCenter } from '@/components/common/NotificationCenter';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  onTriggerDailySummary?: () => void;
}

export function Header({ onTriggerDailySummary }: HeaderProps) {
  const router = useRouter();
  const { user, role, switchRole, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { unreadCount } = useNotificationStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const handleRoleSwitch = (newRole: UserRole) => {
    switchRole(newRole);
    setIsRoleDropdownOpen(false);
    if (newRole === 'super_admin') router.push('/super-admin/dashboard');
    else if (newRole === 'company_admin') router.push('/admin/dashboard');
    else router.push('/sales/dashboard');
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
        {/* Search Trigger */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2 text-sm text-slate-400 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-700 transition-all w-64 md:w-80"
          >
            <Search className="h-4 w-4 text-slate-400" />
            <span className="flex-1 text-left truncate">Tìm khách hàng, đơn hàng, sale...</span>
            <kbd className="hidden rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300 md:inline-block">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-500/20 dark:text-blue-400 transition-all"
            >
              {role === 'super_admin' && <Shield className="h-4 w-4" />}
              {role === 'company_admin' && <Briefcase className="h-4 w-4" />}
              {role === 'sales' && <UserCheck className="h-4 w-4" />}
              <span className="capitalize">{role.replace('_', ' ')}</span>
              <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full">Chuyển</span>
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in duration-150">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Demo Quick Role Switch
                </div>
                <button
                  onClick={() => handleRoleSwitch('super_admin')}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                    role === 'super_admin' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <Shield className="h-4 w-4" /> Super Admin
                </button>
                <button
                  onClick={() => handleRoleSwitch('company_admin')}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                    role === 'company_admin' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <Briefcase className="h-4 w-4" /> Company Admin
                </button>
                <button
                  onClick={() => handleRoleSwitch('sales')}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                    role === 'sales' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <UserCheck className="h-4 w-4" /> Sales Rep (Nguyễn Văn An)
                </button>
              </div>
            )}
          </div>

          {/* 6:00 PM Daily AI Simulation Button */}
          {role === 'sales' && onTriggerDailySummary && (
            <Button
              variant="gradient"
              size="sm"
              onClick={onTriggerDailySummary}
              className="hidden sm:flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 animate-spin" />
              <span>Báo Cáo 18:00 AI</span>
            </Button>
          )}

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="rounded-xl border border-slate-200/80 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title="Đổi Giao Diện"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
          </button>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative rounded-xl border border-slate-200/80 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            {isNotifOpen && <NotificationCenter onClose={() => setIsNotifOpen(false)} />}
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            {/* eslint-disable-next-html-element-suppression */}
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
              alt={user?.name}
              className="h-8 w-8 rounded-full border border-slate-300 dark:border-slate-700"
            />
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
