'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CompanyService } from '@/services/repositories/CompanyService';
import { SalesService } from '@/services/repositories/SalesService';
import { Building2, Users, DollarSign, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RevenueTrendChart, SalesDistributionChart, OrdersStatusChart } from '@/components/charts/CRMCharts';
import { formatVND } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function SuperAdminDashboardPage() {
  const { data: companies = [], isLoading: loadingComp } = useQuery({
    queryKey: ['companies'],
    queryFn: () => CompanyService.getAllCompanies(),
  });

  const { data: sales = [], isLoading: loadingSales } = useQuery({
    queryKey: ['allSales'],
    queryFn: () => SalesService.getAllSales(),
  });

  const totalRevenue = companies.reduce((acc, c) => acc + (c.totalRevenue || 0), 0);
  const activeCompanies = companies.filter((c) => c.status === 'active').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-500" /> Super Admin Global Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tổng quan hiệu suất kinh doanh toàn bộ 5 công ty đối tác CRM
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Tổng Công Ty</span>
              <Building2 className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            {loadingComp ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{companies.length} đối tác</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Tổng Nhân Viên Sales</span>
              <Users className="h-4 w-4 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent>
            {loadingSales ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{sales.length} nhân sự</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Tổng Doanh Thu</span>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            {loadingComp ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-emerald-500">{formatVND(totalRevenue)}</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Công Ty Hoạt Động</span>
              <CheckCircle2 className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCompanies} / {companies.length}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Tăng Trưởng Tháng</span>
              <TrendingUp className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">+18.4% YoY</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Xu Hướng Doanh Thu Toàn Hệ Thống (Tháng 1 - Tháng 7)</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueTrendChart height={300} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tỷ Trọng Doanh Thu Theo Công Ty</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesDistributionChart height={300} />
          </CardContent>
        </Card>
      </div>

      {/* Order Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Phân Phối Đơn Hàng Theo Trạng Thái (800 Đơn Mock Data)</CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersStatusChart height={260} />
        </CardContent>
      </Card>
    </div>
  );
}
