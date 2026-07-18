'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiLogService } from '@/services/repositories/ApiLogService';
import { Activity, CheckCircle2, AlertCircle, Clock, Zap, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const MOCK_USAGE_TREND = [
  { date: '12/07', requests: 1240, latency: 45, errors: 2 },
  { date: '13/07', requests: 1890, latency: 42, errors: 4 },
  { date: '14/07', requests: 2150, latency: 38, errors: 1 },
  { date: '15/07', requests: 2400, latency: 40, errors: 3 },
  { date: '16/07', requests: 3100, latency: 35, errors: 0 },
  { date: '17/07', requests: 2950, latency: 36, errors: 2 },
  { date: '18/07', requests: 3420, latency: 34, errors: 1 },
];

export default function ApiUsageDashboardPage() {
  const { data: logs = [] } = useQuery({
    queryKey: ['apiLogs'],
    queryFn: () => ApiLogService.getApiLogs('comp-1'),
  });

  const totalRequests = 17150;
  const requestsToday = 3420;
  const successRate = 99.8;
  const failedRequests = 13;
  const avgResponseTime = 36;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="h-6 w-6 text-emerald-500" /> Báo Cáo API Usage & Analytics
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Theo dõi lưu lượng truy cập REST API, tốc độ phản hồi (latency) và tỷ lệ thành công của hệ thống Jemmia Diamond
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-1 p-4">
            <span className="text-xs font-semibold text-slate-500">Tổng API Calls</span>
            <Activity className="h-4 w-4 text-blue-500 mt-1" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{totalRequests.toLocaleString()}</div>
            <span className="text-[10px] text-slate-400">Tích lũy từ 01/06</span>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader className="pb-1 p-4">
            <span className="text-xs font-semibold text-slate-500">API Calls Hôm Nay</span>
            <Zap className="h-4 w-4 text-indigo-500 mt-1" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-indigo-400">{requestsToday.toLocaleString()}</div>
            <span className="text-[10px] text-emerald-400">+12% so với hôm qua</span>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-1 p-4">
            <span className="text-xs font-semibold text-slate-500">Success Rate</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-1" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-emerald-500">{successRate}%</div>
            <span className="text-[10px] text-slate-400">SLA 99.9% Available</span>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <CardHeader className="pb-1 p-4">
            <span className="text-xs font-semibold text-slate-500">Yêu Cầu Lỗi (Failed)</span>
            <AlertCircle className="h-4 w-4 text-rose-500 mt-1" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-rose-500">{failedRequests}</div>
            <span className="text-[10px] text-slate-400">Chủ yếu do 401 Unauthorized</span>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-1 p-4">
            <span className="text-xs font-semibold text-slate-500">Avg Latency</span>
            <Clock className="h-4 w-4 text-amber-500 mt-1" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-amber-500">{avgResponseTime} ms</div>
            <span className="text-[10px] text-slate-400">Phản hồi siêu tốc</span>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" /> Lưu Lượng Truy Cập API Theo Ngày (Requests/Day)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_USAGE_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorReq)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Latency Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" /> Tốc Độ Phản Hồi Trung Bình (Latency ms)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_USAGE_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                  <Bar dataKey="latency" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Request Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nhật Ký Gọi API Mới Nhất (Real-Time API Logs)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-xs uppercase text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Phương Thức</th>
                  <th className="px-5 py-3">Endpoint</th>
                  <th className="px-5 py-3">API Key Sử Dụng</th>
                  <th className="px-5 py-3">Mã HTTP Status</th>
                  <th className="px-5 py-3">Thời Gian Phản Hồi</th>
                  <th className="px-5 py-3">Thời Gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <Badge variant={log.method === 'POST' ? 'default' : log.method === 'PUT' ? 'warning' : 'secondary'}>
                        {log.method}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-slate-900 dark:text-white">{log.endpoint}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">{log.apiKeyName}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${log.statusCode < 300 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {log.statusCode} OK
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-amber-400">{log.responseTimeMs} ms</td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">{log.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
