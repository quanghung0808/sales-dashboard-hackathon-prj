'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { OrderService } from '@/services/repositories/OrderService';
import { Order } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { GenericDataTable } from '@/components/tables/GenericDataTable';
import { Tabs } from '@/components/ui/tabs';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ExternalLink, Copy, Check, ShieldCheck, CreditCard } from 'lucide-react';
import { formatFullVND, getStatusBadge } from '@/lib/utils';

const STATUS_TABS: { id: string; label: string }[] = [
  { id: 'All', label: 'Tất cả' },
  { id: 'Pending', label: 'Chờ Xử Lý' },
  { id: 'Confirmed', label: 'Đã Xác Nhận' },
  { id: 'Shipping', label: 'Đang Giao' },
  { id: 'Completed', label: 'Hoàn Thành' },
  { id: 'Cancelled', label: 'Đã Hủy' },
  { id: 'Refunded', label: 'Hoàn Tiền' },
];

export default function OrderManagementPage() {
  const [activeStatus, setActiveStatus] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['salesOrdersListAll'],
    queryFn: () => OrderService.getAllOrders(),
  });

  const filteredOrders = activeStatus === 'All' ? orders : orders.filter((o) => o.status === activeStatus);

  const handleCopyLink = (orderId: string) => {
    const link = `https://crm.jemmia.vn/orders/${orderId}`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'id',
      header: 'Mã Đơn Hàng',
      cell: ({ row }) => <span className="font-bold text-slate-900 dark:text-white">{row.original.id}</span>,
    },
    {
      id: 'orderLink',
      header: 'Link Đơn Hàng',
      cell: ({ row }) => {
        const orderUrl = `https://crm.jemmia.vn/orders/${row.original.id}`;
        return (
          <a
            href={orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-500/20 text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            title={`Mở link đơn hàng https://crm.jemmia.vn/orders/${row.original.id} ở tab mới`}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        );
      },
    },
    {
      accessorKey: 'customerName',
      header: 'Khách Hàng',
      cell: ({ row }) => <span className="font-semibold">{row.original.customerName}</span>,
    },
    {
      accessorKey: 'amount',
      header: () => <div className="text-right">Giá Tiền</div>,
      cell: ({ row }) => (
        <div className="text-right font-bold text-emerald-600 dark:text-emerald-400">
          {formatFullVND(row.original.amount)}
        </div>
      ),
    },
    {
      accessorKey: 'commission',
      header: () => <div className="text-right">Hoa Hồng</div>,
      cell: ({ row }) => (
        <div className="text-right font-semibold text-indigo-500 dark:text-indigo-400">
          {formatFullVND(row.original.commission)}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Trạng Thái',
      cell: ({ row }) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(row.original.status)}`}>
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Ngày Tạo',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-blue-500" /> Đơn hàng
        </h1>
      </div>

      {/* Filter Tabs */}
      <Tabs tabs={STATUS_TABS} activeTab={activeStatus} onChange={(id) => setActiveStatus(id)} />

      {/* Orders Table */}
      <GenericDataTable columns={columns} data={filteredOrders} isLoading={isLoading} searchPlaceholder="Tìm mã đơn hàng, tên khách hàng..." />

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Dialog
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Chi Tiết Đơn Hàng #${selectedOrder.id}`}
          className="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            {/* Copy Direct Link Section */}
            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-500/20 space-y-2">
              <span className="font-bold text-blue-600 dark:text-blue-400 block">Đường Dẫn Đơn Hàng Tra Cứu</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`https://crm.jemmia.vn/orders/${selectedOrder.id}`}
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 font-mono select-all"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyLink(selectedOrder.id)}
                  className="h-8 text-xs flex items-center gap-1 font-bold shrink-0"
                >
                  {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{isCopied ? 'Đã Chép' : 'Sao Chép'}</span>
                </Button>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-slate-400 block text-[11px]">Khách Hàng</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedOrder.customerName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Trạng Thái</span>
                <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs border ${getStatusBadge(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Tổng Giá Trị</span>
                <span className="font-bold text-emerald-600 text-sm">{formatFullVND(selectedOrder.amount)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Hoa Hồng Dự Nhận</span>
                <span className="font-bold text-indigo-500 text-sm">{formatFullVND(selectedOrder.commission)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Sản Phẩm</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedOrder.product}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Ngày Khởi Tạo</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedOrder.createdAt}</span>
              </div>
            </div>

            {/* Certificate & Guarantee Note */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 font-medium">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Đơn hàng kim cương tự nhiên đính kèm Giấy Kiểm Định GIA & Bảo Hành Trọn Đời.</span>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="gradient" onClick={() => setSelectedOrder(null)}>
                Đóng
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
