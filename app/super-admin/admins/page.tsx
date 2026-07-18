'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SettingsService } from '@/services/repositories/SettingsService';
import { CompanyService } from '@/services/repositories/CompanyService';
import { CompanyAdmin } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { GenericDataTable } from '@/components/tables/GenericDataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog } from '@/components/ui/dialog';
import { Plus, Users, Trash2 } from 'lucide-react';

export default function SuperAdminAdminsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyId, setCompanyId] = useState('comp-1');

  const { data: admins = [], isLoading } = useQuery({
    queryKey: ['companyAdmins'],
    queryFn: () => SettingsService.getAdmins(),
  });

  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: () => CompanyService.getAllCompanies(),
  });

  const createMutation = useMutation({
    mutationFn: () => {
      const targetComp = companies.find((c) => c.id === companyId);
      return SettingsService.createAdmin({
        name,
        email,
        phone: '0909 888 999',
        companyId,
        companyName: targetComp?.name || 'Jemmia Diamond',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyAdmins'] });
      setIsModalOpen(false);
      setName('');
      setEmail('');
      setPassword('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => SettingsService.deleteAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyAdmins'] });
    },
  });

  const columns: ColumnDef<CompanyAdmin>[] = [
    {
      accessorKey: 'name',
      header: 'Admin',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-html-element-suppression */}
          <img src={row.original.avatar} alt={row.original.name} className="h-9 w-9 rounded-full border" />
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">{row.original.name}</div>
            <div className="text-xs text-slate-400">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'companyName',
      header: 'Công Ty Quản Lý',
      cell: ({ row }) => <span className="font-semibold text-blue-500">{row.original.companyName || 'Jemmia'}</span>,
    },
    {
      accessorKey: 'phone',
      header: 'Số Điện Thoại',
    },
    {
      accessorKey: 'createdAt',
      header: 'Ngày Khởi Tạo',
    },
    {
      id: 'actions',
      header: 'Thao Tác',
      cell: ({ row }) => (
        <button
          onClick={() => {
            if (confirm(`Xóa Admin ${row.original.name}?`)) {
              deleteMutation.mutate(row.original.id);
            }
          }}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-500 dark:hover:bg-slate-800"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-500" /> Quản Lý Company Admins
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Phân quyền tài khoản Quản trị viên cấp Công ty (10 admins mock data)
          </p>
        </div>
        <Button variant="gradient" onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> Thêm Admin Mới
        </Button>
      </div>

      <GenericDataTable columns={columns} data={admins} isLoading={isLoading} searchPlaceholder="Tìm tên admin, email, công ty..." />

      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tạo Company Admin Mới">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Tên Quản Trị Viên</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Thanh Tùng..." required />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Email Công Việc</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@company.vn" required />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Mật Khẩu Phân Quyền</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Chọn Công Ty</label>
            <Select value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="gradient">
              Tạo Admin
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
