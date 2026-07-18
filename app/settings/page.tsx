'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useThemeStore } from '@/hooks/useThemeStore';
import { Settings, User, Moon, Sun, Globe, Shield, Bot, Award, CheckCircle2, Save, Key, BookOpen, Radio, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, role } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const [name, setName] = useState(user?.name || 'Nguyễn Văn An');
  const [email, setEmail] = useState(user?.email || 'an.nguyen@jemmia.vn');
  const [phone, setPhone] = useState(user?.phone || '0912 345 678');
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-blue-500" /> Cài Đặt Hệ Thống & Cá Nhân
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Quản lý tài khoản cá nhân, giao diện hệ thống và các tích hợp API Multi-Tenant
        </p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-4 text-sm font-semibold text-emerald-400">
          <CheckCircle2 className="h-5 w-5" /> Đã cập nhật hồ sơ cá nhân thành công!
        </div>
      )}

      {/* User Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-5 w-5 text-indigo-500" /> Hồ Sơ Cá Nhân ({role.replace('_', ' ')})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              {/* eslint-disable-next-html-element-suppression */}
              <img src={user?.avatar} alt={user?.name} className="h-16 w-16 rounded-full border-2 border-indigo-500" />
              <div>
                <h3 className="font-bold text-base">{user?.name}</h3>
                <p className="text-xs text-slate-400">{user?.email}</p>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-400 font-bold px-2 py-0.5 rounded-full mt-1 inline-block uppercase">
                  {role}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Họ Và Tên</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Email Công Việc</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Số Điện Thoại Liên Hệ</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="gradient" className="flex items-center gap-1.5">
                <Save className="h-4 w-4" /> Lưu Hồ Sơ
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Multi-Tenant API Integration Hub Shortcuts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Key className="h-5 w-5 text-indigo-500" /> Multi-Tenant REST API Integration Hub
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/settings/api-keys"
            className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all"
          >
            <Key className="h-6 w-6 text-indigo-500" />
            <div>
              <div className="font-bold text-sm">API Access Keys</div>
              <div className="text-xs text-slate-400">Tạo, vô hiệu hóa & quản lý khóa API key (Bearer token)</div>
            </div>
          </Link>

          <Link
            href="/settings/api-docs"
            className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all"
          >
            <BookOpen className="h-6 w-6 text-blue-500" />
            <div>
              <div className="font-bold text-sm">Tài Liệu REST API & Playground</div>
              <div className="text-xs text-slate-400">Tài liệu API chuẩn Stripe, 7 ngôn ngữ SDK & Interactive Playground</div>
            </div>
          </Link>

          <Link
            href="/settings/webhooks"
            className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all"
          >
            <Radio className="h-6 w-6 text-purple-500" />
            <div>
              <div className="font-bold text-sm">Webhooks Registration</div>
              <div className="text-xs text-slate-400">Đăng ký URL nhận sự kiện Đơn hàng, Khách hàng & Báo cáo AI</div>
            </div>
          </Link>

          <Link
            href="/settings/api-usage"
            className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all"
          >
            <Activity className="h-6 w-6 text-emerald-500" />
            <div>
              <div className="font-bold text-sm">API Usage Analytics</div>
              <div className="text-xs text-slate-400">Báo cáo tổng số request, latency & tỷ lệ thành công</div>
            </div>
          </Link>
        </CardContent>
      </Card>

      {/* Preferences (Theme & Language) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="h-5 w-5 text-amber-500" /> Tùy Chỉnh Giao Diện & Ngôn Ngữ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="h-5 w-5 text-indigo-400" /> : <Sun className="h-5 w-5 text-amber-500" />}
              <div>
                <div className="font-semibold text-sm">Giao Diện Hệ Thống</div>
                <div className="text-xs text-slate-400">Hiện tại: {theme === 'dark' ? 'Dark Mode (Tối)' : 'Light Mode (Sáng)'}</div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              Đổi sang {theme === 'dark' ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-blue-500" />
              <div>
                <div className="font-semibold text-sm">Ngôn Ngữ Hiển Thị</div>
                <div className="text-xs text-slate-400">Tiếng Việt (Mặc định) / English</div>
              </div>
            </div>
            <Select value={language} onChange={(e: any) => setLanguage(e.target.value)} className="w-40 h-9">
              <option value="vi">🇻🇳 Tiếng Việt</option>
              <option value="en">🇺🇸 English</option>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
