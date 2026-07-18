'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCheck,
  MessageSquare,
  ShoppingBag,
  Sparkles,
  User,
  ChevronLeft,
  ChevronRight,
  Bot,
  Key,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { role, user } = useAuthStore();

  const displayName = role === 'super_admin' ? 'Sales Pilot' : user?.companyName || 'Jemmia Diamond';

  const [disabled, setDisabled] = useState<Set<string>>(new Set());

  const deactivatable: Record<string, string[]> = {
    super_admin: ['/super-admin/companies', '/super-admin/admins'],
    company_admin: ['/admin/sales'],
  };

  const toggleItem = (href: string) => {
    setDisabled((prev) => {
      const next = new Set(prev);
      if (next.has(href)) next.delete(href);
      else next.add(href);
      return next;
    });
  };

  const navItems = [
    // Super Admin Routes
    {
      label: 'Tổng Quan Hệ Thống',
      href: '/super-admin/dashboard',
      icon: LayoutDashboard,
      roles: ['super_admin'],
    },
    {
      label: 'Quản Lý Công Ty',
      href: '/super-admin/companies',
      icon: Building2,
      roles: ['super_admin'],
    },
    {
      label: 'Quản Lý Admin',
      href: '/super-admin/admins',
      icon: Users,
      roles: ['super_admin'],
    },

    // Company Admin Routes
    {
      label: 'Quản Lý Sales',
      href: '/admin/sales',
      icon: UserCheck,
      roles: ['company_admin'],
    },
    {
      label: 'Cấu Hình AI',
      href: '/admin/ai-settings',
      icon: Bot,
      roles: ['company_admin'],
    },

    // Sales Routes
    {
      label: 'Trợ Lý Sales',
      href: '/sales/dashboard',
      icon: Sparkles,
      roles: ['sales'],
    },
    {
      label: 'Hội Thoại',
      href: '/sales/conversations',
      icon: MessageSquare,
      roles: ['sales'],
    },
    {
      label: 'Đơn Hàng',
      href: '/sales/orders',
      icon: ShoppingBag,
      roles: ['sales'],
    },
    {
      label: 'Khách Hàng',
      href: '/sales/customers',
      icon: Users,
      roles: ['sales'],
    },

    // API Integration & Multi-Tenant Features
    {
      label: 'API Keys',
      href: '/settings/api-keys',
      icon: Key,
      roles: ['company_admin'],
    },
    // Shared Profile
    {
      label: 'Hồ sơ',
      href: '/settings',
      icon: User,
      roles: ['company_admin', 'sales'],
    },
  ];

  const filteredItems = navItems.filter((item) => item.roles.includes(role));

  const canToggle = (href: string) => (deactivatable[role] || []).includes(href);

  return (
    <aside
      className={cn(
        'sticky top-0 z-40 flex h-screen flex-col border-r border-slate-200/80 bg-white/95 backdrop-blur-xl transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/95',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-3 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-rose-500 shadow-md shadow-indigo-500/20 text-white font-black text-base">
            💎
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                {displayName}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                {role === 'super_admin' ? 'Super Admin' : role === 'company_admin' ? 'Company Admin' : 'Sales Workspace'}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors shrink-0"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 space-y-1.5 p-3 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/settings');
          const isDisabled = disabled.has(item.href);
          const showToggle = canToggle(item.href);
          const Icon = item.icon;

          return (
            <div key={item.href}>
              {showToggle ? (
                <button
                  onClick={() => toggleItem(item.href)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive && !isDisabled
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100',
                    isDisabled && 'opacity-40 line-through',
                    isCollapsed && 'justify-center px-0'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="truncate flex-1 text-left">{item.label}</span>
                      <span className={cn(
                        'text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
                        isDisabled
                          ? 'bg-rose-100 text-rose-500 dark:bg-rose-900/30 dark:text-rose-400'
                          : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                      )}>
                        {isDisabled ? 'Không hoạt động' : 'Hoạt động'}
                      </span>
                    </>
                  )}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100',
                    isCollapsed && 'justify-center px-0'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
