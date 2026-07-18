'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OrderService } from '@/services/repositories/OrderService';
import { Order, OrderStatus } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { GenericDataTable } from '@/components/tables/GenericDataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog } from '@/components/ui/dialog';
import { Tabs } from '@/components/ui/tabs';
import { ShoppingBag, Plus } from 'lucide-react';
import { formatVND, getStatusBadge } from '@/lib/utils';

const STATUS_TABS: { id: string; label: string }[] = [
  { id: 'All', label: 'Tất Cả (800)' },
  { id: 'Pending', label: 'Chờ Xử Lý' },
  { id: 'Confirmed', label: 'Đã Xác Nhận' },
  { id: 'Shipping', label: 'Đang Giao' },
  { id: 'Completed', label: 'Hoàn Thành' },
  { id: 'Cancelled', label: 'Đã Hủy' },
  { id: 'Refunded', label: 'Hoàn Tiền' },
];

export default function OrderManagementPage() {
  const queryClient = useQueryClient();
  const [activeStatus, setActiveStatus] = useState<string>('All');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [customerName, setCustomerName] = useState('Nguyễn Văn Hải');
  const [product, setProduct] = useState('Diamond Ring 1ct GIA');
  const [amount, setAmount] = useState(185000000);
  const [status, setStatus] = useState<OrderStatus>('Pending');

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['salesOrdersListAll'],
    queryFn: () => OrderService.getAllOrders(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, newStatus }: { orderId: string; newStatus: OrderStatus }) =>
      OrderService.updateOrderStatus(orderId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesOrdersListAll'] });
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: () => {
      return OrderService.createOrder({
        companyId: 'comp-1',
        customerId: 'cust-1',
        customerName,
        salesId: 'sales-1',
        salesName: 'Nguyễn Văn An',
        product,
        amount,
        status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesOrdersListAll'] });
      setIsCreateOpen(false);
    },
  });

  const filteredOrders = activeStatus === 'All' ? orders : orders.filter((o) => o.status === activeStatus);

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'id',
      header: 'Mã Đơn Hàng',
      cell: ({ row }) => <span className="font-bold text-slate-900 dark:text-white">{row.original.id}</span>,
    },
    {
      accessorKey: 'customerName',
      header: 'Khách Hàng',
    },
    {
      accessorKey: 'product',
      header: 'Sản Phẩm Trang Sức',
      cell: ({ row }) => <Badge variant="outline">{row.original.product}</Badge>,
    },
    {
      accessorKey: 'amount',
      header: 'Giá Trị Đơn',
      cell: ({ row }) => <span className="font-bold text-emerald-500">{formatVND(row.original.amount)}</span>,
    },
    {
      accessorKey: 'commission',
      header: 'Hoa Hồng Sale',
      cell: ({ row }) => <span className="font-semibold text-indigo-400">{formatVND(row.original.commission)}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Trạng Thái',
      cell: ({ row }) => (
        <Select
          value={row.original.status}
          onChange={(e) => updateStatusMutation.mutate({ orderId: row.original.id, newStatus: e.target.value as OrderStatus })}
          className={`h-8 text-xs font-bold ${getStatusBadge(row.original.status)}`}
        >
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Shipping">Shipping</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Refunded">Refunded</option>
        </Select>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Ngày Tạo',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-blue-500" /> Quản Lý Đơn Hàng Trang Sức
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            800 đơn hàng mock data với các trạng thái Pending, Shipping, Completed, Refunded...
          </p>
        </div>
        <Button variant="gradient" onClick={() => setIsCreateOpen(true)} className="flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> Tạo Đơn Hàng Mới
        </Button>
      </div>

      {/* Filter Tabs */}
      <Tabs tabs={STATUS_TABS} activeTab={activeStatus} onChange={(id) => setActiveStatus(id)} />

      {/* Orders Table */}
      <GenericDataTable columns={columns} data={filteredOrders} isLoading={isLoading} searchPlaceholder="Tìm mã đơn hàng, khách hàng, sản phẩm..." />

      {/* Create Order Modal */}
      <Dialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Tạo Đơn Hàng Trang Sức Mới">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createOrderMutation.mutate();
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Tên Khách Hàng</label>
            <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Sản Phẩm Trang Sức</label>
            <Select value={product} onChange={(e) => setProduct(e.target.value)}>
              <option value="Diamond Ring">Diamond Ring (Nhẫn Kim Cương)</option>
              <option value="Wedding Ring">Wedding Ring (Nhẫn Cưới Cặp)</option>
              <option value="Earrings">Earrings (Bông Tai Nước D)</option>
              <option value="Bracelet">Bracelet (Lắc Tay Kim Cương)</option>
              <option value="Necklace">Necklace (Dây Chuyền Vàng 18k)</option>
              <option value="Pendant">Pendant (Mặt Dây Chuyền Bespoke)</option>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Số Tiền (VNĐ)</label>
              <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Trạng Thái Khởi Tạo</label>
              <Select value={status} onChange={(e: any) => setStatus(e.target.value)}>
                <option value="Pending">Pending (Chờ cọc)</option>
                <option value="Confirmed">Confirmed (Đã xác nhận)</option>
                <option value="Shipping">Shipping (Đang giao)</option>
                <option value="Completed">Completed (Hoàn tất)</option>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="gradient">
              Tạo Đơn Hàng
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
