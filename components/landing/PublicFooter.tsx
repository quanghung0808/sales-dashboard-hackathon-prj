'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Code2, Shield, Heart } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-sm py-12 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-lg">
                AI
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white">Sales Pilot</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Nền tảng Quản trị Bán hàng & Trợ lý AI tích hợp chuẩn REST API Multi-Tenant cho doanh nghiệp hiện đại.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">Sản Phẩm</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/#features" className="hover:text-blue-500">Tổng Kết Hội Thoại AI</Link></li>
              <li><Link href="/#features" className="hover:text-blue-500">Báo Cáo AI 18:00 Hàng Ngày</Link></li>
              <li><Link href="/#features" className="hover:text-blue-500">Dòng Thời Gian Khách Hàng 360°</Link></li>
              <li><Link href="/#features" className="hover:text-blue-500">Đa Công Ty (Multi-Tenant)</Link></li>
            </ul>
          </div>

          {/* Developers & API */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">Dành Cho Developer</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/docs" className="hover:text-blue-500 font-semibold text-indigo-400">Tài Liệu API</Link></li>
              <li><Link href="/docs" className="hover:text-blue-500">Thử Nghiệm Tương Tác</Link></li>
              <li><Link href="/settings/api-keys" className="hover:text-blue-500">Quản Lý API Keys</Link></li>
              <li><Link href="/settings/webhooks" className="hover:text-blue-500">Webhook</Link></li>
            </ul>
          </div>

          {/* Solutions Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">Giải Pháp Ngành</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/#solutions" className="hover:text-blue-500">Trang Sức Đá Quý (Jewelry)</Link></li>
              <li><Link href="/#solutions" className="hover:text-blue-500">Bán Lẻ (Retail)</Link></li>
              <li><Link href="/#solutions" className="hover:text-blue-500">Bảo Hiểm & Ngân Hàng</Link></li>
              <li><Link href="/#solutions" className="hover:text-blue-500">Ô Tô (Automotive)</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>© 2026 Nền tảng AI Sales CRM. Hackathon Production Demo.</div>
          <div className="flex items-center gap-4">
            <Link href="/docs" className="hover:text-slate-200">Chuẩn API</Link>
            <Link href="/login" className="hover:text-slate-200">Trạng Thái Hệ Thống</Link>
            <Link href="/#privacy" className="hover:text-slate-200">Chính Sách Bảo Mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
