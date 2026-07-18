'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { ROLE_NOTIFICATIONS } from '@/services/mock/mockData';
import { Bell, CheckCheck, Sparkles, Target, User, ShoppingBag, ShieldCheck, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DailyAISummaryModal } from '@/features/sales/DailyAISummaryModal';
import { NotificationItem } from '@/types';

interface NotificationCenterProps {
  onClose: () => void;
}

export function NotificationCenter({ onClose }: NotificationCenterProps) {
  const { role } = useAuthStore();
  const [isDailyReportOpen, setIsDailyReportOpen] = useState(false);

  const initialItems = ROLE_NOTIFICATIONS[role] || ROLE_NOTIFICATIONS.sales;
  const [items, setItems] = useState<NotificationItem[]>(initialItems);

  const markAsRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'kpi':
        return <Target className="h-4 w-4 text-emerald-400" />;
      case 'customer':
        return <User className="h-4 w-4 text-blue-400" />;
      case 'order':
        return <ShoppingBag className="h-4 w-4 text-amber-400" />;
      case 'ai_summary':
        return <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />;
      default:
        return <Bell className="h-4 w-4 text-slate-400" />;
    }
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    markAsRead(notif.id);
    if (notif.type === 'ai_summary' && role === 'sales') {
      setIsDailyReportOpen(true);
    }
  };

  return (
    <>
      <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
            <Bell className="h-4 w-4 text-blue-500" />
            <span>Thông Báo {role === 'super_admin' ? 'Super Admin' : role === 'company_admin' ? 'Company Admin' : 'Sales Workspace'}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-7 text-xs flex items-center gap-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
            <CheckCheck className="h-3.5 w-3.5" /> Đọc tất cả
          </Button>
        </div>

        <div className="mt-3 max-h-80 overflow-y-auto space-y-2">
          {items.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">Không có thông báo mới</div>
          ) : (
            items.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`flex items-start gap-3 rounded-xl p-2.5 transition-all cursor-pointer ${
                  notif.read
                    ? 'bg-transparent opacity-70'
                    : 'bg-blue-50/60 dark:bg-blue-950/30 border border-blue-500/20'
                }`}
              >
                <div className="mt-0.5 rounded-lg bg-slate-100 p-2 dark:bg-slate-800 shrink-0">
                  {getNotifIcon(notif.type)}
                </div>
                <div className="flex-1 text-xs">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                    <span>{notif.title}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{notif.timestamp}</span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">{notif.message}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {role === 'sales' && (
        <DailyAISummaryModal isOpen={isDailyReportOpen} onClose={() => setIsDailyReportOpen(false)} />
      )}
    </>
  );
}
