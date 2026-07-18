'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/common/Sidebar';
import { Header } from '@/components/common/Header';
import { DailyAISummaryModal } from '@/features/sales/DailyAISummaryModal';
import { PublicNavbar } from '@/components/landing/PublicNavbar';
import { PublicFooter } from '@/components/landing/PublicFooter';

export function DashboardLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDailyReportOpen, setIsDailyReportOpen] = useState(false);

  // Dedicated Login Page rendering (Full screen)
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // Public Marketing Website & Public API Documentation Pages
  if (pathname === '/' || pathname === '/docs') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors flex flex-col justify-between">
        <PublicNavbar />
        <main className="flex-1">{children}</main>
        <PublicFooter />
      </div>
    );
  }

  // Private SaaS CRM Dashboard Layout (Authenticated Workspace)
  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      {/* Sticky Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Workspace */}
      <div className="flex flex-1 flex-col overflow-x-hidden min-w-0">
        <Header onTriggerDailySummary={() => setIsDailyReportOpen(true)} />
        <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Daily AI Summary Modal (Triggerable from Header) */}
      <DailyAISummaryModal
        isOpen={isDailyReportOpen}
        onClose={() => setIsDailyReportOpen(false)}
      />
    </div>
  );
}
