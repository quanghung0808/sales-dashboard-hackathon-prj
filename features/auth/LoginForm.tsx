'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { UserRole } from '@/types';
import { useRouter } from 'next/navigation';
import { Shield, Briefcase, UserCheck, Sparkles, ArrowRight, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LoginForm() {
  const router = useRouter();
  const { loginAs } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>('sales');
  const [email, setEmail] = useState('an.nguyen@jemmia.vn');
  const [password, setPassword] = useState('••••••••••••');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'super_admin') {
      setEmail('superadmin@crm.vn');
    } else if (role === 'company_admin') {
      setEmail('tung.nguyen@jemmia.vn');
    } else {
      setEmail('an.nguyen@jemmia.vn');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs(selectedRole);
    if (selectedRole === 'super_admin') {
      router.push('/super-admin/companies');
    } else if (selectedRole === 'company_admin') {
      router.push('/admin/sales');
    } else {
      router.push('/sales/dashboard');
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-rose-500 text-white font-black text-2xl shadow-xl shadow-indigo-500/30 mb-2">
          AI
        </div>
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-rose-500 bg-clip-text text-transparent">
          AI Sales CRM Dashboard
        </h1>
        <p className="text-xs text-slate-400">
          Nền tảng Quản trị & Trợ lý Bán hàng Thông minh
        </p>
      </div>

      {/* Role Switcher Tabs */}
      <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-1.5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/80 grid grid-cols-3 gap-1">
        <button
          type="button"
          onClick={() => handleRoleSelect('super_admin')}
          className={`flex flex-col items-center gap-1 rounded-xl py-2.5 text-xs font-semibold transition-all ${
            selectedRole === 'super_admin'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Shield className="h-4 w-4" />
          <span>Super Admin</span>
        </button>

        <button
          type="button"
          onClick={() => handleRoleSelect('company_admin')}
          className={`flex flex-col items-center gap-1 rounded-xl py-2.5 text-xs font-semibold transition-all ${
            selectedRole === 'company_admin'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>Company Admin</span>
        </button>

        <button
          type="button"
          onClick={() => handleRoleSelect('sales')}
          className={`flex flex-col items-center gap-1 rounded-xl py-2.5 text-xs font-semibold transition-all ${
            selectedRole === 'sales'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>Sales Rep</span>
        </button>
      </div>

      {/* Login Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-xl backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/90 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-blue-500" /> Email Đăng Nhập
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email của bạn..."
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-blue-500" /> Mật Khẩu
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu..."
              required
            />
          </div>

          <Button type="submit" className="w-full h-11 text-base font-semibold" variant="gradient">
            <span>Đăng Nhập Ngay ({selectedRole.replace('_', ' ')})</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </form>

        {/* Quick Preset Login Buttons */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
            Demo 1-Click Login Presets
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                loginAs('super_admin');
                router.push('/super-admin/companies');
              }}
              className="text-[11px] py-1 px-1 h-8"
            >
              Super Admin
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                loginAs('company_admin');
                router.push('/admin/sales');
              }}
              className="text-[11px] py-1 px-1 h-8 truncate"
            >
              Jemmia Admin
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                loginAs('sales');
                router.push('/sales/dashboard');
              }}
              className="text-[11px] py-1 px-1 h-8 truncate"
            >
              Sale Văn An
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
