'use client';

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SalesService } from '@/services/repositories/SalesService';
import { OrderService } from '@/services/repositories/OrderService';
import { CustomerService } from '@/services/repositories/CustomerService';
import { KPIService } from '@/services/repositories/KPIService';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Users, DollarSign, Target, Award, ShoppingCart, UserPlus, TrendingUp, Repeat } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RevenueTrendChart, OrdersStatusChart } from '@/components/charts/CRMCharts';
import { formatVND } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const MONTH_NAMES = ['', 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

function currentPeriod() {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    monthLabel: MONTH_NAMES[now.getMonth() + 1],
    monthStr: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
  };
}

export default function CompanyAdminDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const companyId = user?.companyId || 'comp-1';
  const companyName = user?.companyName || 'Công Ty';

  const { month, year, monthLabel, monthStr } = currentPeriod();

  const { data: sales = [] } = useQuery({
    queryKey: ['salesRepList', companyId],
    queryFn: () => SalesService.getAllSales(companyId),
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['companyOrders'],
    queryFn: () => OrderService.getAllOrders(),
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['companyCustomers'],
    queryFn: () => CustomerService.getAllCustomers(),
  });

  const { data: kpis = [] } = useQuery({
    queryKey: ['companyKpis'],
    queryFn: () => KPIService.getKPIMetrics(),
  });

  const companyOrders = useMemo(
    () => orders.filter((o) => o.companyId === companyId),
    [orders, companyId],
  );

  const companyCustomers = useMemo(
    () => customers.filter((c) => c.companyId === companyId),
    [customers, companyId],
  );

  const companySales = useMemo(
    () => sales.filter((s) => s.companyId === companyId),
    [sales, companyId],
  );

  const currentMonthKpi = kpis.find((k) => k.periodType === 'monthly') || kpis[0];
  const quartersKpi = kpis.find((k) => k.periodType === 'quarterly');
  const yearlyKpi = kpis.find((k) => k.periodType === 'yearly');

  const totalRevenue = companySales.reduce((acc, s) => acc + s.revenue, 0);
  const totalCommission = companySales.reduce((acc, s) => acc + s.commission, 0);

  const completedOrders = companyOrders.filter((o) => o.status === 'Completed');
  const completedRevenue = completedOrders.reduce((acc, o) => acc + o.amount, 0);
  const orderCountByStatus = useMemo(() => {
    const statuses = ['Completed', 'Confirmed', 'Shipping', 'Pending', 'Cancelled', 'Refunded'];
    const counts: Record<string, number> = {};
    for (const st of statuses) counts[st] = 0;
    for (const o of companyOrders) counts[o.status] = (counts[o.status] || 0) + 1;
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  }, [companyOrders]);

  const thisMonthOrders = companyOrders.filter((o) => o.createdAt.startsWith(monthStr));
  const thisMonthCustomers = companyCustomers.filter((c) => c.createdAt.startsWith(monthStr));

  const aov = completedOrders.length > 0
    ? Math.round(completedRevenue / completedOrders.length)
    : 0;

  const conversionRate = companyCustomers.length > 0 && completedOrders.length > 0
    ? ((completedOrders.length / companyCustomers.length) * 100).toFixed(1)
    : '0';

  const orderChartColors: Record<string, string> = {
    Completed: '#10b981',
    Confirmed: '#3b82f6',
    Shipping: '#6366f1',
    Pending: '#f59e0b',
    Cancelled: '#ef4444',
    Refunded: '#94a3b8',
  };

  const orderChartData = orderCountByStatus.map((d) => ({
    ...d,
    fill: orderChartColors[d.status] || '#94a3b8',
  }));

  const lastUpdated = new Date().toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Báo Cáo Hiệu Suất: {companyName}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {monthLabel} {year} &middot; Cập nhật lúc {lastUpdated}
          </p>
        </div>
      </div>

      {/* Row 1 — Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Tổng Đội Ngũ Sales</span>
              <Users className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companySales.length} Nhân viên</div>
            <p className="text-[11px] text-slate-400 mt-1">{companySales.filter((s) => s.kpiAchieved >= 80).length} người đạt ≥80% KPI</p>
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
            <div className="text-2xl font-bold text-emerald-500">{formatVND(totalRevenue)}</div>
            <p className="text-[11px] text-slate-400 mt-1">AOV {formatVND(aov)}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Tiến Độ KPI {monthLabel}</span>
              <Target className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {currentMonthKpi
                ? `${Math.round((currentMonthKpi.revenueAchieved / currentMonthKpi.revenueTarget) * 100)}%`
                : '--'}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {currentMonthKpi
                ? `${formatVND(currentMonthKpi.revenueAchieved)} / ${formatVND(currentMonthKpi.revenueTarget)}`
                : 'Chưa có dữ liệu'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Tổng Hoa Hồng</span>
              <Award className="h-4 w-4 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatVND(totalCommission)}</div>
            <p className="text-[11px] text-slate-400 mt-1">
              {companySales.filter((s) => s.commission > 0).length} người đủ điều kiện
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Row 2 — KPI Detail Mini Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2 flex-row items-center gap-2 space-y-0">
            <ShoppingCart className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-semibold text-slate-500">Đơn Hàng</span>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {thisMonthOrders.length}
              {currentMonthKpi ? (
                <span className="text-sm font-normal text-slate-400">
                  {' '}/ {currentMonthKpi.ordersTarget}
                </span>
              ) : null}
            </div>
            <p className="text-[11px] text-slate-400">
              {currentMonthKpi
                ? `Đạt ${Math.round((thisMonthOrders.length / currentMonthKpi.ordersTarget) * 100)}% mục tiêu`
                : 'Tháng này'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex-row items-center gap-2 space-y-0">
            <UserPlus className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-semibold text-slate-500">Khách Hàng Mới</span>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {thisMonthCustomers.length}
              {currentMonthKpi ? (
                <span className="text-sm font-normal text-slate-400">
                  {' '}/ {currentMonthKpi.customersTarget}
                </span>
              ) : null}
            </div>
            <p className="text-[11px] text-slate-400">
              {currentMonthKpi
                ? `Đạt ${Math.round((thisMonthCustomers.length / currentMonthKpi.customersTarget) * 100)}% mục tiêu`
                : 'Tháng này'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex-row items-center gap-2 space-y-0">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <span className="text-xs font-semibold text-slate-500">Tỉ Lệ Chốt Đơn</span>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {currentMonthKpi ? `${currentMonthKpi.conversionAchieved}%` : '--'}
            </div>
            <p className="text-[11px] text-slate-400">
              Mục tiêu {currentMonthKpi ? `${currentMonthKpi.conversionTarget}%` : '--'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex-row items-center gap-2 space-y-0">
            <Repeat className="h-4 w-4 text-rose-500" />
            <span className="text-xs font-semibold text-slate-500">Khách Hàng Quay Lại</span>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {currentMonthKpi ? `${currentMonthKpi.repeatCustomersAchieved}%` : '--'}
            </div>
            <p className="text-[11px] text-slate-400">
              Mục tiêu {currentMonthKpi ? `${currentMonthKpi.repeatCustomersTarget}%` : '--'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Row 3 — Charts */}
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
            {companySales
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 5)
              .map((s, idx) => (
                <div key={s.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm w-4 text-slate-400">#{idx + 1}</span>
                    <img src={s.avatar} alt={s.name} className="h-8 w-8 rounded-full border" />
                    <div>
                      <div className="font-semibold text-xs">{s.name}</div>
                      <div className="text-[10px] text-slate-400">{s.department}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-500 block">{formatVND(s.revenue)}</span>
                    <Badge variant={s.kpiAchieved >= 100 ? 'success' : s.kpiAchieved >= 80 ? 'warning' : 'danger'} className="text-[10px]">
                      {s.kpiAchieved}% KPI
                    </Badge>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Row 4 — Order Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Phân Bố Trạng Thái Đơn Hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <OrdersStatusChart data={orderChartData} height={260} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tổng Quan KPI Năm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {yearlyKpi ? (
              <>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-500">Doanh Thu</span>
                    <span>{formatVND(yearlyKpi.revenueAchieved)} / {formatVND(yearlyKpi.revenueTarget)}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full"
                      style={{ width: `${Math.min(100, (yearlyKpi.revenueAchieved / yearlyKpi.revenueTarget) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-500">Đơn Hàng</span>
                    <span>{yearlyKpi.ordersAchieved} / {yearlyKpi.ordersTarget}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                      style={{ width: `${Math.min(100, (yearlyKpi.ordersAchieved / yearlyKpi.ordersTarget) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-500">Khách Hàng Mới</span>
                    <span>{yearlyKpi.customersAchieved} / {yearlyKpi.customersTarget}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, (yearlyKpi.customersAchieved / yearlyKpi.customersTarget) * 100)}%` }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-400">Chưa có dữ liệu KPI năm</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
