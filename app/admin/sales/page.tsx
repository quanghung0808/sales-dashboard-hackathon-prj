'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SalesService } from '@/services/repositories/SalesService';
import { SalesRep } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { GenericDataTable } from '@/components/tables/GenericDataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog } from '@/components/ui/dialog';
import { Plus, Edit3, UserCheck } from 'lucide-react';
import { formatFullVND } from '@/lib/utils';

export default function SalesManagementPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSales, setSelectedSales] = useState<SalesRep | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('VIP Consultation');
  const [kpiTarget, setKpiTarget] = useState(450000000);
  const [commissionRate, setCommissionRate] = useState(4);

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ['salesRepList'],
    queryFn: () => SalesService.getAllSales('comp-1'),
  });

  const saveMutation = useMutation({
    mutationFn: () => {
      if (selectedSales) {
        return SalesService.updateSales(selectedSales.id, {
          name,
          email,
          phone,
          department,
          kpiTarget,
          commissionRate,
        });
      }
      return SalesService.createSales({
        name,
        email,
        phone,
        department,
        companyId: 'comp-1',
        companyName: 'Jemmia Diamond',
        joinDate: new Date().toISOString().split('T')[0],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        kpiTarget,
        commissionRate,
        createdAt: new Date().toISOString().split('T')[0],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesRepList'] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => SalesService.deleteSales(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesRepList'] });
    },
  });

  const handleOpenEdit = (s: SalesRep) => {
    setSelectedSales(s);
    setName(s.name);
    setEmail(s.email);
    setPhone(s.phone);
    setDepartment(s.department || 'VIP Consultation');
    setKpiTarget(s.kpiTarget);
    setCommissionRate(s.commissionRate || 4);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setSelectedSales(null);
    setName('');
    setEmail('');
    setPhone('');
    setDepartment('VIP Consultation');
    setKpiTarget(450000000);
    setCommissionRate(4);
    setIsModalOpen(true);
  };

  const columns: ColumnDef<SalesRep>[] = [
    {
      accessorKey: 'name',
      header: 'Nhân Viên Sales',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-html-element-suppression */}
          <img src={row.original.avatar} alt={row.original.name} className="h-9 w-9 rounded-full border shrink-0" />
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">{row.original.name}</div>
            <div className="text-xs text-slate-400">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Số Điện Thoại',
    },
    {
      accessorKey: 'revenue',
      header: () => <div className="text-right">Doanh Số</div>,
      cell: ({ row }) => (
        <div className="text-right font-bold text-emerald-600 dark:text-emerald-400">
          {formatFullVND(row.original.revenue)}
        </div>
      ),
    },
    {
      accessorKey: 'kpiTarget',
      header: () => <div className="text-right">Chỉ Tiêu KPI</div>,
      cell: ({ row }) => (
        <div className="text-right font-semibold text-slate-700 dark:text-slate-300">
          {formatFullVND(row.original.kpiTarget)}
        </div>
      ),
    },
    {
      accessorKey: 'kpiAchieved',
      header: () => <div className="text-right">Đạt KPI (%)</div>,
      cell: ({ row }) => {
        const val = row.original.kpiAchieved;
        const color = val >= 100 ? 'text-emerald-500 font-bold' : val >= 80 ? 'text-amber-500 font-bold' : 'text-rose-500';
        return <div className="text-right"><span className={color}>{val}%</span></div>;
      },
    },
    {
      accessorKey: 'commissionRate',
      header: () => <div className="text-right">% Hoa Hồng</div>,
      cell: ({ row }) => (
        <div className="text-right"><span className="font-extrabold text-amber-500">{row.original.commissionRate || 4}%</span></div>
      ),
    },
    {
      accessorKey: 'commission',
      header: () => <div className="text-right">Hoa Hồng Trả</div>,
      cell: ({ row }) => (
        <div className="text-right font-semibold text-indigo-500 dark:text-indigo-400">
          {formatFullVND(row.original.commission)}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Thao Tác',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleOpenEdit(row.original)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-amber-500 dark:hover:bg-slate-800"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Title (No Subtitle) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <UserCheck className="h-6 w-6 text-blue-500" /> Sales
        </h1>
        <Button variant="gradient" onClick={handleOpenCreate} className="flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> Thêm Nhân Viên Sales
        </Button>
      </div>

      <GenericDataTable columns={columns} data={sales} isLoading={isLoading} searchPlaceholder="Tìm tên sale, SĐT..." />

      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedSales ? 'Chỉnh Sửa Nhân Viên Sales' : 'Thêm Nhân Viên Sales Mới'}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate();
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Họ Và Tên</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn An..." required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Email Công Việc</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Số Điện Thoại</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Phòng Ban</label>
              <Select value={department} onChange={(e) => setDepartment(e.target.value)}>
                <option value="Diamond Sales">Diamond Sales</option>
                <option value="VIP Consultation">VIP Consultation</option>
                <option value="Wedding Rings">Wedding Rings</option>
                <option value="Custom Design">Custom Design</option>
                <option value="Online Sales">Online Sales</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Chỉ Tiêu KPI (VNĐ)</label>
              <Input type="number" value={kpiTarget} onChange={(e) => setKpiTarget(Number(e.target.value))} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">% Hoa Hồng Cấp</label>
              <Input type="number" value={commissionRate} onChange={(e) => setCommissionRate(Number(e.target.value))} required min={0} max={100} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="gradient">
              Lưu Nhân Viên
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
