'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { KPIService } from '@/services/repositories/KPIService';
import { KPIMetric } from '@/types';
import { Target, TrendingUp, Users, ShoppingBag, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog } from '@/components/ui/dialog';
import { formatVND } from '@/lib/utils';
import { Tabs } from '@/components/ui/tabs';

export default function KPIManagementPage() {
  const queryClient = useQueryClient();
  const [periodType, setPeriodType] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [periodName, setPeriodName] = useState('Tháng 8/2026');
  const [revenueTarget, setRevenueTarget] = useState(500000000);
  const [ordersTarget, setOrdersTarget] = useState(100);
  const [customersTarget, setCustomersTarget] = useState(60);
  const [conversionTarget, setConversionTarget] = useState(30);

  const { data: kpis = [] } = useQuery({
    queryKey: ['companyKpis'],
    queryFn: () => KPIService.getKPIMetrics(),
  });

  const activeKpi = kpis.find((k) => k.periodType === periodType) || kpis[0];

  const saveMutation = useMutation({
    mutationFn: () => {
      const newKpi: KPIMetric = {
        id: `kpi-${Date.now()}`,
        companyId: 'comp-1',
        periodType,
        periodName,
        revenueTarget,
        revenueAchieved: Math.floor(revenueTarget * 0.75),
        ordersTarget,
        ordersAchieved: Math.floor(ordersTarget * 0.8),
        customersTarget,
        customersAchieved: Math.floor(customersTarget * 0.7),
        conversionTarget,
        conversionAchieved: conversionTarget - 2,
        repeatCustomersTarget: 35,
        repeatCustomersAchieved: 38,
        createdAt: new Date().toISOString().split('T')[0],
      };
      return KPIService.saveKPIMetric(newKpi);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyKpis'] });
      setIsModalOpen(false);
    },
  });

  const revPercent = activeKpi ? Math.round((activeKpi.revenueAchieved / activeKpi.revenueTarget) * 100) : 78;
  const orderPercent = activeKpi ? Math.round((activeKpi.ordersAchieved / activeKpi.ordersTarget) * 100) : 82;
  const custPercent = activeKpi ? Math.round((activeKpi.customersAchieved / activeKpi.customersTarget) * 100) : 74;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="h-6 w-6 text-amber-500" /> Quản Lý Chỉ Tiêu KPI Doanh Nghiệp
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Cấu hình chỉ tiêu doanh thu, đơn hàng, khách hàng theo Tháng, Quý & Năm
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs
            tabs={[
              { id: 'monthly', label: '12 Tháng' },
              { id: 'quarterly', label: '4 Quý' },
              { id: 'yearly', label: 'Cả Năm' },
            ]}
            activeTab={periodType}
            onChange={(id: any) => setPeriodType(id)}
          />
          <Button variant="gradient" onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5">
            <Plus className="h-4 w-4" /> Thêm KPI Mới
          </Button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      {activeKpi && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <span className="text-xs font-semibold text-slate-400">Mục Tiêu Doanh Thu ({activeKpi.periodName})</span>
              <CardTitle className="text-xl text-emerald-500">{formatVND(activeKpi.revenueAchieved)}</CardTitle>
              <div className="text-xs text-slate-500">Chỉ tiêu: {formatVND(activeKpi.revenueTarget)}</div>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-2">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(revPercent, 100)}%` }} />
              </div>
              <div className="flex justify-between text-xs mt-2 font-bold">
                <span>Tiến độ</span>
                <span className="text-emerald-500">{revPercent}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <span className="text-xs font-semibold text-slate-400">Số Lượng Đơn Hàng</span>
              <CardTitle className="text-xl text-blue-500">{activeKpi.ordersAchieved} Đơn</CardTitle>
              <div className="text-xs text-slate-500">Chỉ tiêu: {activeKpi.ordersTarget} Đơn</div>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-2">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(orderPercent, 100)}%` }} />
              </div>
              <div className="flex justify-between text-xs mt-2 font-bold">
                <span>Tiến độ</span>
                <span className="text-blue-500">{orderPercent}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <span className="text-xs font-semibold text-slate-400">Khách Hàng Mới</span>
              <CardTitle className="text-xl text-purple-500">{activeKpi.customersAchieved} Khách</CardTitle>
              <div className="text-xs text-slate-500">Chỉ tiêu: {activeKpi.customersTarget} Khách</div>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(custPercent, 100)}%` }} />
              </div>
              <div className="flex justify-between text-xs mt-2 font-bold">
                <span>Tiến độ</span>
                <span className="text-purple-500">{custPercent}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <span className="text-xs font-semibold text-slate-400">Tỷ Lệ Chốt Đơn (Conversion)</span>
              <CardTitle className="text-xl text-amber-500">{activeKpi.conversionAchieved}%</CardTitle>
              <div className="text-xs text-slate-500">Chỉ tiêu: {activeKpi.conversionTarget}%</div>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-2">
                <div className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((activeKpi.conversionAchieved / activeKpi.conversionTarget) * 100, 100)}%` }} />
              </div>
              <div className="flex justify-between text-xs mt-2 font-bold">
                <span>Đạt được</span>
                <span className="text-amber-500">{activeKpi.conversionAchieved}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Thiết Lập Chỉ Tiêu KPI Mới">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate();
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Tên Kỳ KPI</label>
            <Input value={periodName} onChange={(e) => setPeriodName(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Chỉ Tiêu Doanh Thu (VNĐ)</label>
              <Input type="number" value={revenueTarget} onChange={(e) => setRevenueTarget(Number(e.target.value))} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Chỉ Tiêu Đơn Hàng</label>
              <Input type="number" value={ordersTarget} onChange={(e) => setOrdersTarget(Number(e.target.value))} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Chỉ Tiêu Khách Mới</label>
              <Input type="number" value={customersTarget} onChange={(e) => setCustomersTarget(Number(e.target.value))} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Tỷ Lệ Chốt Đơn (%)</label>
              <Input type="number" value={conversionTarget} onChange={(e) => setConversionTarget(Number(e.target.value))} required />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="gradient">
              Lưu KPI
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
