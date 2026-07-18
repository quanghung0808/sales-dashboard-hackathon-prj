'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCheck,
  TrendingUp,
  MessageSquare,
  ShoppingBag,
  Target,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bot,
  Award,
  Key,
  BookOpen,
  Radio,
  Activity,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { role, user } = useAuthStore();

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
      label: 'Báo Cáo Công Ty',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      roles: ['company_admin'],
    },
    {
      label: 'Đội Ngũ Sales',
      href: '/admin/sales',
      icon: UserCheck,
      roles: ['company_admin'],
    },
    {
      label: 'Chỉ Tiêu KPI',
      href: '/admin/kpi',
      icon: Target,
      roles: ['company_admin'],
    },
    {
      label: 'Cấu Hình Hoa Hồng',
      href: '/admin/commission',
      icon: Award,
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
      label: 'Sales Assistant',
      href: '/sales/dashboard',
      icon: Sparkles,
      roles: ['sales'],
    },
    {
      label: 'Hội Thoại & AI Score',
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
      label: 'API Access Keys',
      href: '/settings/api-keys',
      icon: Key,
      roles: ['super_admin', 'company_admin'],
    },
    {
      label: 'Tài Liệu REST API',
      href: '/settings/api-docs',
      icon: BookOpen,
      roles: ['super_admin', 'company_admin', 'sales'],
    },
    {
      label: 'Webhooks Event',
      href: '/settings/webhooks',
      icon: Radio,
      roles: ['super_admin', 'company_admin'],
    },
    {
      label: 'API Usage Analytics',
      href: '/settings/api-usage',
      icon: Activity,
      roles: ['super_admin', 'company_admin'],
    },

    // Shared Settings
    {
      label: 'Cài Đặt',
      href: '/settings',
      icon: Settings,
      roles: ['super_admin', 'company_admin', 'sales'],
    },
  ];

  const filteredItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={cn(
        'sticky top-0 z-40 flex h-screen flex-col border-r border-slate-200/80 bg-white/95 backdrop-blur-xl transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/95',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-rose-500 shadow-md shadow-indigo-500/20 text-white font-black text-xl">
            AI
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-base font-bold bg-gradient-to-r from-blue-600 via-indigo-500 to-rose-500 bg-clip-text text-transparent">
                Sales CRM AI
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                {role === 'super_admin' ? 'Super Admin' : role === 'company_admin' ? user?.companyName || 'Company Admin' : 'Sales Workspace'}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 space-y-1.5 p-3 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/settings');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
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
          );
        })}
      </div>

      {/* Footer User Info */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80">
        <div
          className={cn(
            'flex items-center gap-3 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60',
            isCollapsed && 'justify-center p-2'
          )}
        >
          {/* eslint-disable-next-html-element-suppression */}
          <img
            src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Default'}
            alt="Avatar"
            className="h-8 w-8 rounded-full border border-slate-300 dark:border-slate-700 shrink-0"
          />
          {!isCollapsed && (
            <div className="flex flex-col truncate text-xs">
              <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.name}</span>
              <span className="text-slate-400 truncate capitalize">{role.replace('_', ' ')}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
