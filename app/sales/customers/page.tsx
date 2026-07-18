'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CustomerService } from '@/services/repositories/CustomerService';
import { OrderService } from '@/services/repositories/OrderService';
import { Customer } from '@/types';
import { MOCK_TIMELINE_EVENTS } from '@/services/mock/mockData';
import { ColumnDef } from '@tanstack/react-table';
import { GenericDataTable } from '@/components/tables/GenericDataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Users, Eye, Sparkles, ShoppingBag, MapPin, Phone, Mail, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { formatFullVND } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function CustomerManagementPage() {
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['salesCustomersAll'],
    queryFn: () => CustomerService.getAllCustomers(),
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['allOrders'],
    queryFn: () => OrderService.getAllOrders(),
  });

  const customerOrders = selectedCust
    ? orders.filter((o) => o.customerId === selectedCust.id || o.customerName === selectedCust.name)
    : [];

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'name',
      header: 'Khách Hàng',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-html-element-suppression */}
          <img src={row.original.avatar} alt={row.original.name} className="h-9 w-9 rounded-full border shrink-0" />
          <div>
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{row.original.name}</span>
              <Badge variant={row.original.tier === 'VIP' ? 'danger' : row.original.tier === 'Gold' ? 'warning' : 'secondary'} className="text-[9px]">
                {row.original.tier}
              </Badge>
            </div>
            <div className="text-xs text-slate-400">{row.original.phone}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'city',
      header: 'Thành Phố',
      cell: ({ row }) => (
        <span className="flex items-center gap-1 text-xs">
          <MapPin className="h-3.5 w-3.5 text-slate-400" /> {row.original.city}
        </span>
      ),
    },
    {
      accessorKey: 'favoriteProduct',
      header: 'Sản Phẩm Yêu Thích',
      cell: ({ row }) => <Badge variant="outline">{row.original.favoriteProduct}</Badge>,
    },
    {
      accessorKey: 'totalSpent',
      header: () => <div className="text-right">Tổng Chi Tiêu</div>,
      cell: ({ row }) => (
        <div className="text-right font-bold text-emerald-600 dark:text-emerald-400">
          {formatFullVND(row.original.totalSpent)}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Chi Tiết',
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedCust(row.original)}
          className="h-8 text-xs flex items-center gap-1 font-bold"
        >
          <Eye className="h-3.5 w-3.5" /> Chi Tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Title (No Subtitle) */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="h-6 w-6 text-purple-500" /> Khách hàng 360
        </h1>
      </div>

      <GenericDataTable columns={columns} data={customers} isLoading={isLoading} searchPlaceholder="Tìm tên khách hàng, thành phố, SĐT, sản phẩm thích..." />

      {/* Customer 360 Dialog (No Title Header / Subtitle) */}
      {selectedCust && (
        <Dialog
          isOpen={!!selectedCust}
          onClose={() => setSelectedCust(null)}
          className="max-w-5xl"
        >
          <div className="space-y-6">
            {/* Top Profile Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-blue-600/10 border border-purple-500/20 gap-4">
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-html-element-suppression */}
                <img src={selectedCust.avatar} alt={selectedCust.name} className="h-16 w-16 rounded-full border-2 border-purple-500" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedCust.name}</h3>
                    <Badge variant="danger">{selectedCust.tier} Member</Badge>
                  </div>
                  <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3 mt-1">
                    <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {selectedCust.phone}</span>
                    <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {selectedCust.email}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {selectedCust.city}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Sinh nhật: {selectedCust.birthday}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Tổng Chi Tiêu</span>
                <span className="text-xl font-black text-emerald-500">{formatFullVND(selectedCust.totalSpent)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: AI Summary & Recommended Products */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-amber-500" /> AI Customer Insight
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs text-slate-300">
                    <p className="leading-relaxed">
                      Khách hàng <span className="font-bold text-white">{selectedCust.name}</span> có thói quen chốt mua sản phẩm trang sức kim cương tự nhiên vào dịp kỷ niệm ngày cưới tháng 7. Thái độ tương tác thân thiện, ưu tiên các mẫu kiểm định GIA.
                    </p>
                    <div className="pt-2 border-t border-slate-800">
                      <span className="font-bold text-indigo-400 block mb-1">Gợi Ý Sản Phẩm Cross-Sell:</span>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="outline">Bộ Dây Chuyền Kim Cương 4ly</Badge>
                        <Badge variant="outline">Lắc Tay Vàng Trắng 18k</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-1.5">
                      <ShoppingBag className="h-4 w-4 text-blue-500" /> Lịch Sử Đơn Hàng ({customerOrders.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {customerOrders.length === 0 ? (
                      <div className="text-xs text-slate-400">Chưa có đơn hàng phát sinh</div>
                    ) : (
                      customerOrders.slice(0, 3).map((ord) => (
                        <div key={ord.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs flex justify-between items-center">
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{ord.product}</div>
                            <div className="text-[10px] text-slate-400">{ord.id} • {ord.createdAt}</div>
                          </div>
                          <span className="font-bold text-emerald-500">{formatFullVND(ord.amount)}</span>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right: Customer Journey Timeline */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-indigo-500" /> Hành Trình Trải Nghiệm Khách Hàng (Customer Timeline)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                      {MOCK_TIMELINE_EVENTS.map((evt) => (
                        <div key={evt.id} className="relative text-xs">
                          <div className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                            <CheckCircle2 className="h-3 w-3" />
                          </div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                            <span>{evt.title}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{evt.date}</span>
                          </div>
                          <p className="text-slate-400 mt-0.5">{evt.description}</p>
                          <span className="text-[10px] text-indigo-400 mt-0.5 block">Sale thực hiện: {evt.salesOwner}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
