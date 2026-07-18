'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SalesService } from '@/services/repositories/SalesService';
import { CustomerService } from '@/services/repositories/CustomerService';
import { ConversationService } from '@/services/repositories/ConversationService';
import { OrderService } from '@/services/repositories/OrderService';
import { MockAIService } from '@/services/mock/mockAIService';
import { Customer, Conversation } from '@/types';
import {
  Sparkles,
  Calendar,
  DollarSign,
  ShoppingBag,
  Users,
  Award,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { RevenueTrendChart } from '@/components/charts/CRMCharts';
import { formatVND } from '@/lib/utils';
import { Customer360Modal } from '@/features/sales/Customer360Modal';
import { ChatSimulatorDrawer } from '@/features/sales/ChatSimulatorDrawer';

type DateFilterOption = 'Today' | 'This Week' | 'This Month' | 'This Quarter';

export default function SalesCopilotDashboardPage() {
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('This Month');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals & Drawers
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);

  const [aiBrief, setAiBrief] = useState({
    greeting: '👋 Chào buổi sáng, Nguyễn Văn An!',
    kpiText: 'Bạn đã đạt 82% chỉ tiêu KPI tháng này (820.000.000đ).',
    highlights: [
      '🔥 3 khách hàng có xác suất chốt đơn cao (>90%).',
      '📞 5 khách hàng cần liên hệ lại hôm nay.',
      '⚠️ 2 đơn hàng đang chờ xác nhận cọc.',
    ],
  });

  const { data: currentSales } = useQuery({
    queryKey: ['salesRep', dateFilter],
    queryFn: () => SalesService.getSalesById('sales-1'),
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['copilotCustomersAll'],
    queryFn: () => CustomerService.getAllCustomers(),
  });

  const { data: conversations = [] } = useQuery({
    queryKey: ['copilotConvsAll'],
    queryFn: () => ConversationService.getAllConversations(),
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['copilotOrdersAll'],
    queryFn: () => OrderService.getAllOrders(),
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const summary = await MockAIService.generateCopilotHeroSummary({
      salesName: currentSales?.name || 'Nguyễn Văn An',
      kpiPercent: 82,
      revenue: 820000000,
      targetRevenue: 1000000000,
      highProbabilityCount: 3,
      pendingFollowupCount: 5,
      pendingOrderCount: 2,
      projectedKpi: 94,
    });
    setAiBrief({
      greeting: summary.greeting,
      kpiText: summary.kpiStatement,
      highlights: [
        summary.highlights.highProbText,
        summary.highlights.followupText,
        summary.highlights.pendingOrdersText,
      ],
    });
    setIsRefreshing(false);
  };

  useEffect(() => {
    handleRefresh();
  }, [dateFilter]);

  // Tasks List
  const tasks = [
    { id: '1', title: '🔥 Call Nguyễn Văn A', reason: 'Chưa tương tác >4 ngày', priority: 'High', custName: 'Nguyễn Văn A' },
    { id: '2', title: '📩 Gửi báo giá Lan Anh', reason: 'Khách yêu cầu báo giá nhẫn cưới hôm qua', priority: 'High', custName: 'Trần Thị Lan Anh' },
    { id: '3', title: '💰 Xác nhận Đơn #ORD-2032', reason: 'Chờ cọc >2 ngày', priority: 'High', custName: 'Đỗ Minh Đức' },
    { id: '4', title: '🎂 Chúc sinh nhật Phạm Minh Tuấn', reason: 'Sinh nhật khách VIP hôm nay', priority: 'Medium', custName: 'Phạm Minh Tuấn' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* 1. Header & Date Filter */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">AI Sales Copilot Workspace</h1>
          <p className="text-xs text-slate-400">Trợ lý bán hàng hỗ trợ chốt đơn & quản lý KPI</p>
        </div>
        <Select value={dateFilter} onChange={(e: any) => setDateFilter(e.target.value)} className="h-9 text-xs font-semibold w-40">
          <option value="Today">Hôm Nay</option>
          <option value="This Week">Tuần Này</option>
          <option value="This Month">Tháng Này</option>
          <option value="This Quarter">Quý Này</option>
        </Select>
      </div>

      {/* 2. AI Brief Hero */}
      <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-4 w-4" /> AI Daily Brief ({dateFilter})
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="h-8 text-xs gap-1 font-bold">
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{aiBrief.greeting}</h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-1">{aiBrief.kpiText}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {aiBrief.highlights.map((h, i) => (
            <div key={i} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200">
              {h}
            </div>
          ))}
        </div>
      </div>

      {/* 3. 4 Core Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-1">
            <span className="text-xs text-slate-500">Doanh Thu</span>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-blue-600">820M / 1B</div>
            <span className="text-[11px] text-emerald-500 font-semibold">82% KPI</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <span className="text-xs text-slate-500">Đơn Hàng</span>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-emerald-600">16 / 20 Đơn</div>
            <span className="text-[11px] text-emerald-500 font-semibold">80% Đạt</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <span className="text-xs text-slate-500">Khách Hàng</span>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-purple-600">34 / 40 Khách</div>
            <span className="text-[11px] text-emerald-500 font-semibold">85% Đạt</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <span className="text-xs text-slate-500">Hoa Hồng</span>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-amber-600">41.000.000đ</div>
            <span className="text-[11px] text-slate-400 font-semibold">Bậc Thưởng 5%</span>
          </CardContent>
        </Card>
      </div>

      {/* 4. Action Center Tasks & Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Nhiệm Vụ Cần Làm Hôm Nay</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {tasks.map((t) => (
              <div key={t.id} className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">{t.title}</span>
                  <Badge variant={t.priority === 'High' ? 'danger' : 'warning'} className="text-[9px] py-0">{t.priority}</Badge>
                </div>
                <p className="text-[11px] text-slate-400">{t.reason}</p>
                <button
                  onClick={() => {
                    const c = customers.find((cust) => cust.name.includes(t.custName.split(' ')[0])) || customers[0];
                    setSelectedCust(c);
                  }}
                  className="text-[11px] text-blue-500 font-bold hover:underline block pt-1"
                >
                  Xem Khách Hàng 360° →
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Biểu Đồ Doanh Thu Tháng 1 - Tháng 7</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueTrendChart height={220} />
          </CardContent>
        </Card>
      </div>

      {/* 5. Orders List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Đơn Hàng Gần Đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 uppercase text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-2.5">Mã Đơn</th>
                  <th className="px-4 py-2.5">Khách Hàng</th>
                  <th className="px-4 py-2.5">Sản Phẩm</th>
                  <th className="px-4 py-2.5">Giá Trị</th>
                  <th className="px-4 py-2.5">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-2.5 font-bold font-mono">{ord.id}</td>
                    <td className="px-4 py-2.5 font-semibold">{ord.customerName}</td>
                    <td className="px-4 py-2.5">{ord.product}</td>
                    <td className="px-4 py-2.5 font-bold text-emerald-600">{formatVND(ord.amount)}</td>
                    <td className="px-4 py-2.5 font-bold">{ord.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Customer 360 Modal */}
      {selectedCust && (
        <Customer360Modal
          customer={selectedCust}
          isOpen={!!selectedCust}
          onClose={() => setSelectedCust(null)}
        />
      )}

      {/* Chat Simulator Drawer */}
      {selectedConv && (
        <ChatSimulatorDrawer
          conversation={selectedConv}
          isOpen={!!selectedConv}
          onClose={() => setSelectedConv(null)}
        />
      )}
    </div>
  );
}
