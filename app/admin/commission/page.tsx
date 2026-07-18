'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { KPIService } from '@/services/repositories/KPIService';
import { CommissionRule } from '@/types';
import { Award, Plus, Trash2, Edit3, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';

export default function CommissionConfigPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [minKpi, setMinKpi] = useState(0);
  const [maxKpi, setMaxKpi] = useState<number | null>(80);
  const [rate, setRate] = useState(0);

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ['commissionRules'],
    queryFn: () => KPIService.getCommissionRules(),
  });

  const saveMutation = useMutation({
    mutationFn: (newRules: CommissionRule[]) => KPIService.saveCommissionRules(newRules),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissionRules'] });
      setIsModalOpen(false);
    },
  });

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    const newRule: CommissionRule = {
      id: `comm-${Date.now()}`,
      companyId: 'comp-1',
      minKpiPercent: minKpi,
      maxKpiPercent: maxKpi,
      commissionRate: rate,
      label: label || `${minKpi}% - ${maxKpi ? maxKpi + '%' : 'trên'}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    saveMutation.mutate([...rules, newRule]);
  };

  const handleDeleteRule = (id: string) => {
    saveMutation.mutate(rules.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="h-6 w-6 text-indigo-500" /> Cấu Hình Chính Sách Hoa Hồng (Commission Rules)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Thiết lập bảng bậc hoa hồng dựa trên phần trăm đạt chỉ tiêu KPI của nhân viên Sales
          </p>
        </div>
        <Button variant="gradient" onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> Thêm Quy Tắc Hoa Hồng
        </Button>
      </div>

      {/* Rules Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bảng Quy Tắc Hoa Hồng Theo Mức Đạt KPI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-xs uppercase text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Mức Đạt KPI (%)</th>
                  <th className="px-6 py-4">Tỷ Lệ Thưởng Hoa Hồng (%)</th>
                  <th className="px-6 py-4">Mô Tả Quy Tắc</th>
                  <th className="px-6 py-4">Trạng Thái</th>
                  <th className="px-6 py-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {rule.maxKpiPercent === null
                        ? `>${rule.minKpiPercent}% KPI`
                        : `${rule.minKpiPercent}% - ${rule.maxKpiPercent}% KPI`}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                        {rule.commissionRate}% Doanh Thu
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{rule.label}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-500 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Áp dụng toàn công ty
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-500 dark:hover:bg-slate-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Thêm Bậc Hoa Hồng Mới">
        <form onSubmit={handleAddRule} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Tên Nhãn Quy Tắc</label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Ví dụ: Đạt KPI xuất sắc (>120%)" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">KPI Tối Thiểu (%)</label>
              <Input type="number" value={minKpi} onChange={(e) => setMinKpi(Number(e.target.value))} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">KPI Tối Đa (% - Nhập 0 nếu không giới hạn)</label>
              <Input
                type="number"
                value={maxKpi === null ? 0 : maxKpi}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMaxKpi(val === 0 ? null : val);
                }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Tỷ Lệ Hoa Hồng Thưởng (%)</label>
            <Input type="number" step="0.5" value={rate} onChange={(e) => setRate(Number(e.target.value))} required />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="gradient">
              Lưu Quy Tắc
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
