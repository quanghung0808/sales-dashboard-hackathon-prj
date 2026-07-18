'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import { formatMillions } from '@/lib/utils';

export type ChartPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year';

export interface RevenuePoint {
  label: string;
  revenue: number;
  target?: number;
}

interface RevenueTrendChartProps {
  height?: number;
  period?: ChartPeriod;
  data?: RevenuePoint[];
}

const DEFAULT_MONTHLY_REVENUE_DATA: RevenuePoint[] = [
  { label: 'T1', revenue: 280, target: 300 },
  { label: 'T2', revenue: 320, target: 300 },
  { label: 'T3', revenue: 410, target: 350 },
  { label: 'T4', revenue: 380, target: 350 },
  { label: 'T5', revenue: 450, target: 400 },
  { label: 'T6', revenue: 510, target: 400 },
  { label: 'T7', revenue: 485, target: 450 },
];

const ORDER_STATUS_DATA = [
  { status: 'Completed', count: 420, fill: '#10b981' },
  { status: 'Confirmed', count: 180, fill: '#3b82f6' },
  { status: 'Shipping', count: 110, fill: '#6366f1' },
  { status: 'Pending', count: 45, fill: '#f59e0b' },
  { status: 'Cancelled', count: 25, fill: '#ef4444' },
  { status: 'Refunded', count: 20, fill: '#94a3b8' },
];

const SALES_DISTRIBUTION_DATA = [
  { name: 'Jemmia Diamond', value: 38, fill: '#3b82f6' },
  { name: 'Diamond World', value: 26, fill: '#6366f1' },
  { name: 'Luxury Jewelry', value: 18, fill: '#ec4899' },
  { name: 'Golden Ring', value: 12, fill: '#f59e0b' },
  { name: 'Shine Jewelry', value: 6, fill: '#10b981' },
];

const CONVERSATION_SCORE_DATA = [
  { range: '90 - 100 (Rất Cao)', count: 680, fill: '#10b981' },
  { range: '75 - 89 (Cao)', count: 820, fill: '#3b82f6' },
  { range: '60 - 74 (Trung bình)', count: 340, fill: '#f59e0b' },
  { range: '< 60 (Rủi ro)', count: 160, fill: '#ef4444' },
];

export function RevenueTrendChart({ height = 280, data }: RevenueTrendChartProps) {
  const chartData = data && data.length > 0 ? data : DEFAULT_MONTHLY_REVENUE_DATA;

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
          <XAxis dataKey="label" tickLine={false} stroke="#94a3b8" fontSize={12} />
          <YAxis
            tickLine={false}
            stroke="#94a3b8"
            fontSize={12}
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toLocaleString('vi-VN', { maximumFractionDigits: 3 })} tỷ` : `${v}tr`)}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
            formatter={(value: any) => [formatMillions(Number(value)), 'Doanh Thu']}
          />
          <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OrdersDonutChart({ height = 240 }: { height?: number }) {
  return (
    <div className="w-full flex items-center justify-center" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={ORDER_STATUS_DATA}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={4}
            dataKey="count"
            nameKey="status"
          >
            {ORDER_STATUS_DATA.map((entry, index) => (
              <Cell key={`pie-ord-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
            formatter={(val: any) => [`${val} đơn`, 'Số lượng']}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function KPIProgressChart() {
  const kpiItems = [
    { label: 'Doanh Thu', current: 820, target: 1000, percent: 82, color: 'from-blue-600 to-indigo-600' },
    { label: 'Số Đơn Hàng', current: 16, target: 20, percent: 80, color: 'from-emerald-500 to-teal-400' },
    { label: 'Khách Hàng Mới', current: 34, target: 40, percent: 85, color: 'from-purple-500 to-pink-500' },
    { label: 'Tỉ Lệ Chốt Đơn', current: 28, target: 32, percent: 88, color: 'from-amber-500 to-rose-500' },
  ];

  return (
    <div className="space-y-4 py-2">
      {kpiItems.map((item, idx) => (
        <div key={idx} className="space-y-1.5 text-xs">
          <div className="flex justify-between font-medium">
            <span className="text-slate-700 dark:text-slate-300 font-semibold">{item.label}</span>
            <span className="font-bold text-slate-900 dark:text-white">{item.percent}% ({item.current}/{item.target})</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className={`bg-gradient-to-r ${item.color} h-full rounded-full transition-all duration-500`}
              style={{ width: `${item.percent}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

interface OrderStatusItem {
  status: string;
  count: number;
  fill: string;
}

export function OrdersStatusChart({ height = 260, data }: { height?: number; data?: OrderStatusItem[] }) {
  const chartData = data && data.length > 0 ? data : ORDER_STATUS_DATA;
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
          <XAxis dataKey="status" tickLine={false} stroke="#94a3b8" fontSize={11} />
          <YAxis tickLine={false} stroke="#94a3b8" fontSize={12} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SalesDistributionChart({ height = 240 }: { height?: number }) {
  return (
    <div className="w-full flex items-center justify-center" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={SALES_DISTRIBUTION_DATA}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {SALES_DISTRIBUTION_DATA.map((entry, index) => (
              <Cell key={`pie-cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
            formatter={(val: any) => [`${val}%`, 'Tỷ trọng Doanh Thu']}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ConversationScoreChart({ height = 260 }: { height?: number }) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={CONVERSATION_SCORE_DATA} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
          <XAxis type="number" stroke="#94a3b8" fontSize={12} />
          <YAxis dataKey="range" type="category" stroke="#94a3b8" fontSize={11} width={130} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
          />
          <Bar dataKey="count" radius={[0, 8, 8, 0]}>
            {CONVERSATION_SCORE_DATA.map((entry, index) => (
              <Cell key={`score-cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
