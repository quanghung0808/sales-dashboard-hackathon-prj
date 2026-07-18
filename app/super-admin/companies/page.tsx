'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CompanyService } from '@/services/repositories/CompanyService';
import { Company } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { GenericDataTable } from '@/components/tables/GenericDataTable';
import { CompanyModal } from '@/features/companies/CompanyModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit3, Eye, Building2 } from 'lucide-react';
import { formatVND, getStatusBadge } from '@/lib/utils';
import { Dialog } from '@/components/ui/dialog';

export default function SuperAdminCompaniesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [viewCompany, setViewCompany] = useState<Company | null>(null);

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: () => CompanyService.getAllCompanies(),
  });

  const saveMutation = useMutation({
    mutationFn: (companyData: Partial<Company>) => {
      if (selectedCompany) {
        return CompanyService.updateCompany(selectedCompany.id, companyData);
      }
      return CompanyService.createCompany(companyData as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setIsModalOpen(false);
      setSelectedCompany(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => CompanyService.deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });

  const columns: ColumnDef<Company>[] = [
    {
      accessorKey: 'name',
      header: 'Công Ty',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg dark:bg-slate-800">
            {row.original.logo}
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">{row.original.name}</div>
            <div className="text-xs text-slate-400">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'industry',
      header: 'Lĩnh Vực',
    },
    {
      accessorKey: 'salesCount',
      header: 'Số Sales',
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-bold">
          {row.original.salesCount || 10} nhân sự
        </Badge>
      ),
    },
    {
      accessorKey: 'totalRevenue',
      header: 'Doanh Thu',
      cell: ({ row }) => (
        <span className="font-bold text-emerald-500">{formatVND(row.original.totalRevenue || 0)}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Trạng Thái',
      cell: ({ row }) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(row.original.status)}`}>
          {row.original.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Ngày Tạo',
    },
    {
      id: 'actions',
      header: 'Thao Tác',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewCompany(row.original)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-500 dark:hover:bg-slate-800"
            title="Xem Chi Tiết"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setSelectedCompany(row.original);
              setIsModalOpen(true);
            }}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-amber-500 dark:hover:bg-slate-800"
            title="Chỉnh Sửa"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-500" /> Quản Lý Danh Sách Công Ty
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Quản lý 5 đối tác doanh nghiệp kinh doanh trang sức đá quý
          </p>
        </div>
        <Button
          variant="gradient"
          onClick={() => {
            setSelectedCompany(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" /> Thêm Công Ty Mới
        </Button>
      </div>

      {/* Generic Data Table */}
      <GenericDataTable
        columns={columns}
        data={companies}
        isLoading={isLoading}
        searchPlaceholder="Tìm tên công ty, email, lĩnh vực..."
      />

      {/* Modal Create/Edit */}
      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => saveMutation.mutate(data)}
        company={selectedCompany}
      />

      {/* Detail View Dialog */}
      {viewCompany && (
        <Dialog
          isOpen={!!viewCompany}
          onClose={() => setViewCompany(null)}
          title={`Chi Tiết: ${viewCompany.name}`}
          description="Thông tin trụ sở và liên hệ doanh nghiệp"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80">
              <span className="text-4xl">{viewCompany.logo}</span>
              <div>
                <h3 className="text-lg font-bold">{viewCompany.name}</h3>
                <p className="text-sm text-slate-500">{viewCompany.industry}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-slate-400 block">Email</span>
                <span className="font-medium">{viewCompany.email}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Số Điện Thoại</span>
                <span className="font-medium">{viewCompany.phone}</span>
              </div>
              <div className="col-span-2">
                <span className="text-xs text-slate-400 block">Địa Chỉ Trụ Sở</span>
                <span className="font-medium">{viewCompany.address}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Doanh Thu Tích Lũy</span>
                <span className="font-bold text-emerald-500">{formatVND(viewCompany.totalRevenue || 0)}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Ngày Gia Nhập</span>
                <span className="font-medium">{viewCompany.createdAt}</span>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
