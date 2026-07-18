'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useThemeStore } from '@/hooks/useThemeStore';
import { useNotificationStore } from '@/hooks/useNotificationStore';
import { Moon, Sun, Bell, LogOut, Settings } from 'lucide-react';
import { NotificationCenter } from '@/components/common/NotificationCenter';
import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { unreadCount } = useNotificationStore();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
      {/* Left Title / Workspace info */}
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
          {user?.companyName || 'Jemmia Diamond'} • Workspace
        </h2>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="rounded-xl border border-slate-200/80 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          title="Đổi Giao Diện Light / Dark"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
        </button>

        {/* Notifications Center */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative rounded-xl border border-slate-200/80 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title="Thông Báo Hệ Thống"
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

        {/* User Avatar -> Navigates to /settings on click */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <button
            onClick={() => router.push('/settings')}
            className="flex items-center gap-2 rounded-xl p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Vào Trang Cài Đặt"
          >
            {/* eslint-disable-next-html-element-suppression */}
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
              alt={user?.name}
              className="h-8 w-8 rounded-full border border-slate-300 dark:border-slate-700"
            />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden sm:inline-block">
              {user?.name}
            </span>
          </button>

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
  );
}
