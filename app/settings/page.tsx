'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { SalesService } from '@/services/repositories/SalesService';
import { User, CheckCircle2, Save, Percent } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  const { user, role } = useAuthStore();

  const [name, setName] = useState(user?.name || 'Nguyễn Văn An');
  const [email, setEmail] = useState(user?.email || 'an.nguyen@jemmia.vn');
  const [phone, setPhone] = useState(user?.phone || '0912 345 678');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Dynamically fetch sales rep account data if role is sales
  const { data: salesAccount } = useQuery({
    queryKey: ['salesAccountProfile', user?.email],
    queryFn: async () => {
      const allSales = await SalesService.getAllSales();
      return allSales.find((s) => s.email === user?.email || s.id === 'sales-1') || allSales[0];
    },
    enabled: role === 'sales',
  });

  const displayCommissionRate = `${salesAccount?.commissionRate ?? 4}%`;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <User className="h-6 w-6 text-blue-500" /> Hồ sơ
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Quản lý tài khoản cá nhân
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Họ Và Tên</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Email Công Việc</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className={`grid grid-cols-1 ${role === 'sales' ? 'sm:grid-cols-2' : ''} gap-4`}>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Số Điện Thoại Liên Hệ</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              {role === 'sales' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold flex items-center gap-1">
                    <Percent className="h-3.5 w-3.5 text-amber-500" /> % Hoa Hồng
                  </label>
                  <Input
                    value={displayCommissionRate}
                    disabled
                    readOnly
                    className="bg-slate-100 dark:bg-slate-800/80 font-bold text-amber-600 dark:text-amber-400 cursor-not-allowed border-amber-500/20"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="gradient" className="flex items-center gap-1.5">
                <Save className="h-4 w-4" /> Lưu Hồ Sơ
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
