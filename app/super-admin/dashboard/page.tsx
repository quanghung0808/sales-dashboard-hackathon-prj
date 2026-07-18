'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CompanyService } from '@/services/repositories/CompanyService';
import { Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatFullVND } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#3b82f6', '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#14b8a6'];

const SEAT_PRICE = 99000; // 99k/tháng/sales

function calcPlatformFee(salesCount: number | undefined): number {
  return (salesCount || 5) * SEAT_PRICE * 12;
}

export default function SuperAdminDashboardPage() {
  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: () => CompanyService.getAllCompanies(),
  });

  const chartData = companies.map((c, i) => ({
    name: c.name,
    value: calcPlatformFee(c.salesCount),
    fill: COLORS[i % COLORS.length],
  }));

  const totalPlatform = chartData.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-500" /> Tổng Quan Hệ Thống
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Doanh thu nền tảng — Tổng {formatFullVND(totalPlatform)}/năm
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Doanh Thu Nền Tảng Theo Công Ty</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">Chưa có dữ liệu</p>
          ) : (
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="w-full lg:w-1/2" style={{ height: 340 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={140}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                      formatter={(value: any) => [formatFullVND(Number(value) || 0) + '/năm', 'Phí nền tảng']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full lg:w-1/2 space-y-3">
                {chartData.map((d) => {
                  const pct = ((d.value / totalPlatform) * 100).toFixed(1);
                  const seats = companies.find((c) => c.name === d.name)?.salesCount || 0;
                  return (
                    <div key={d.name} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.fill }} />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{d.name}</div>
                        <div className="text-xs text-slate-400">{seats} sales &middot; {formatFullVND(d.value)}/năm</div>
                      </div>
                      <div className="text-lg font-extrabold text-slate-700 dark:text-slate-300">{pct}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
