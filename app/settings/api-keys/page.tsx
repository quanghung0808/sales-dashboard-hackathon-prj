'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiKeyService } from '@/services/repositories/ApiKeyService';
import { ApiKey } from '@/types';
import { Key, Plus, Copy, RefreshCw, Power, CheckCircle2, Shield, Eye, EyeOff } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';

export default function ApiAccessKeysPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visibleKeyIds, setVisibleKeyIds] = useState<string[]>([]);

  const { data: keys = [], isLoading } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: () => ApiKeyService.getApiKeys('comp-1'),
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => ApiKeyService.createApiKey(name, 'comp-1'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
      setIsCreateOpen(false);
      setKeyName('');
    },
  });

  const regenerateMutation = useMutation({
    mutationFn: (id: string) => ApiKeyService.regenerateApiKey(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['apiKeys'] }),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => ApiKeyService.toggleApiKeyStatus(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['apiKeys'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ApiKeyService.deleteApiKey(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['apiKeys'] }),
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeyIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const maskKey = (key: string, isVisible: boolean) => {
    if (isVisible) return key;
    return `${key.substring(0, 16)}••••••••••••••••`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Key className="h-6 w-6 text-indigo-500" /> Quản Lý API Access Keys (Multi-Tenant)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Khóa truy cập REST API để kết nối hệ thống CRM / ERP / E-commerce riêng của công ty Jemmia Diamond
          </p>
        </div>
        <Button variant="gradient" onClick={() => setIsCreateOpen(true)} className="flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> Tạo API Key Mới
        </Button>
      </div>

      {copiedId && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-3 text-xs font-bold text-emerald-400">
          <CheckCircle2 className="h-4 w-4" /> Đã sao chép API Key vào khay nhớ tạm! (Authorization: Bearer ...)
        </div>
      )}

      {/* Keys List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Danh Sách API Keys Khả Dụng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-xs uppercase text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Tên API Key</th>
                  <th className="px-5 py-3.5">Giá Trị Key</th>
                  <th className="px-5 py-3.5">Trạng Thái</th>
                  <th className="px-5 py-3.5">Người Tạo</th>
                  <th className="px-5 py-3.5">Dùng Cuối</th>
                  <th className="px-5 py-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {keys.map((k) => {
                  const isVisible = visibleKeyIds.includes(k.id);
                  return (
                    <tr key={k.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{k.name}</td>
                      <td className="px-5 py-4 font-mono text-xs text-indigo-400">
                        <div className="flex items-center gap-2">
                          <span>{maskKey(k.key, isVisible)}</span>
                          <button
                            onClick={() => toggleKeyVisibility(k.id)}
                            className="text-slate-400 hover:text-slate-200"
                            title="Hiện / Ẩn Key"
                          >
                            {isVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={k.status === 'Active' ? 'success' : 'danger'}>{k.status}</Badge>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-400">{k.createdBy}</td>
                      <td className="px-5 py-4 text-xs text-slate-400">{k.lastUsedAt || 'Vừa khởi tạo'}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => copyToClipboard(k.key, k.id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-500 dark:hover:bg-slate-800"
                            title="Copy API Key"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Tạo lại API Key này? Khóa cũ sẽ bị vô hiệu hóa ngay lập tức!'))
                                regenerateMutation.mutate(k.id);
                            }}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-amber-500 dark:hover:bg-slate-800"
                            title="Regenerate Key"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => toggleStatusMutation.mutate(k.id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-purple-500 dark:hover:bg-slate-800"
                            title={k.status === 'Active' ? 'Disable Key' : 'Enable Key'}
                          >
                            <Power className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Tạo API Access Key Mới">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate(keyName);
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Tên Mục Đích Tích Hợp Key</label>
            <Input
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="Ví dụ: ERP Sync Production Key, Website Order Webhook..."
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="gradient">
              Tạo API Key
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
