'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { SalesService } from '@/services/repositories/SalesService';
import { KPIService } from '@/services/repositories/KPIService';
import { Users, Target, DollarSign, Award, TrendingUp, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RevenueTrendChart, OrdersStatusChart } from '@/components/charts/CRMCharts';
import { formatVND } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function CompanyAdminDashboardPage() {
  const { data: sales = [] } = useQuery({
    queryKey: ['salesRepList'],
    queryFn: () => SalesService.getAllSales('comp-1'),
  });

  const { data: kpis = [] } = useQuery({
    queryKey: ['companyKpis'],
    queryFn: () => KPIService.getKPIMetrics(),
  });

  const currentMonthKpi = kpis.find((k) => k.periodType === 'monthly') || kpis[0];
  const totalCompanyRevenue = sales.reduce((acc, s) => acc + s.revenue, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-blue-500" /> Báo Cáo Hiệu Suất: Jemmia Diamond
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Theo dõi mục tiêu KPI, hoa hồng bán hàng và đội ngũ kinh doanh
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Tổng Đội Ngũ Sales</span>
              <Users className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sales.length} Nhân viên</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Doanh Thu Toàn Công Ty</span>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{formatVND(totalCompanyRevenue)}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Tiến Độ KPI Tháng 7</span>
              <Target className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {currentMonthKpi ? Math.round((currentMonthKpi.revenueAchieved / currentMonthKpi.revenueTarget) * 100) : 78}%
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Hoa Hồng Đã Chi Trả</span>
              <Award className="h-4 w-4 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatVND(totalCompanyRevenue * 0.045)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Xu Hướng Doanh Số Bán Hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueTrendChart height={280} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Sales Xuất Sắc Nhất Tháng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sales.slice(0, 5).map((s, idx) => (
              <div key={s.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm w-4 text-slate-400">#{idx + 1}</span>
                  {/* eslint-disable-next-html-element-suppression */}
                  <img src={s.avatar} alt={s.name} className="h-8 w-8 rounded-full border" />
                  <div>
                    <div className="font-semibold text-xs">{s.name}</div>
                    <div className="text-[10px] text-slate-400">{s.department}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-500 block">{formatVND(s.revenue)}</span>
                  <Badge variant="success" className="text-[10px]">{s.kpiAchieved}% KPI</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
