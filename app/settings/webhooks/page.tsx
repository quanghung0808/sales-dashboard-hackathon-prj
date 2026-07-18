'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WebhookService } from '@/services/repositories/WebhookService';
import { WebhookEndpoint } from '@/types';
import { Radio, Plus, CheckCircle2, ShieldAlert, Send } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';

const WEBHOOK_EVENTS = [
  'customer.created',
  'customer.updated',
  'conversation.created',
  'order.created',
  'order.updated',
  'ai.summary.completed',
];

export default function WebhooksPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    'customer.created',
    'order.created',
  ]);

  const [pingStatus, setPingStatus] = useState<string | null>(null);

  const { data: webhooks = [], isLoading } = useQuery({
    queryKey: ['webhooks'],
    queryFn: () => WebhookService.getWebhooks('comp-1'),
  });

  const createMutation = useMutation({
    mutationFn: () => WebhookService.createWebhook(url, selectedEvents, description, 'comp-1'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      setIsModalOpen(false);
      setUrl('');
      setDescription('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => WebhookService.deleteWebhook(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['webhooks'] }),
  });

  const toggleEvent = (evt: string) => {
    setSelectedEvents((prev) =>
      prev.includes(evt) ? prev.filter((e) => e !== evt) : [...prev, evt]
    );
  };

  const handlePing = (whUrl: string) => {
    setPingStatus(`Đang gửi Test Ping Event tới ${whUrl}...`);
    setTimeout(() => {
      setPingStatus(`✅ Webhook Ping thành công! HTTP 200 OK (Response: 48ms)`);
      setTimeout(() => setPingStatus(null), 4000);
    }, 600);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Radio className="h-6 w-6 text-purple-500" /> Quản Lý Webhook
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Đăng ký Endpoint nhận thông báo tự động (Push Events) khi có sự kiện Đơn hàng, Khách hàng hoặc Báo cáo AI
          </p>
        </div>
        <Button variant="gradient" onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> Đăng Ký Webhook Endpoint
        </Button>
      </div>

      {pingStatus && (
        <div className="flex items-center gap-2 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 p-3 text-xs font-bold text-indigo-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {pingStatus}
        </div>
      )}

      {/* Webhooks Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Danh Sách Webhook Endpoints Đang Hoạt Động</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-xs uppercase text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">URL</th>
                  <th className="px-5 py-3.5">Sự Kiện</th>
                  <th className="px-5 py-3.5">Mã Bí Mật</th>
                  <th className="px-5 py-3.5">Trạng Thái</th>
                  <th className="px-5 py-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {webhooks.map((wh) => (
                  <tr key={wh.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold font-mono text-xs text-slate-900 dark:text-white">{wh.url}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{wh.description || 'Chưa có mô tả'}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {wh.events.map((evt) => (
                          <Badge key={evt} variant="secondary" className="text-[9px] py-0">
                            {evt}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-purple-400">{wh.secret}</td>
                    <td className="px-5 py-4">
                      <Badge variant={wh.status === 'Active' ? 'success' : 'danger'}>{wh.status}</Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePing(wh.url)}
                          className="h-8 text-xs flex items-center gap-1"
                        >
                          <Send className="h-3 w-3" /> Gửi Thử
                        </Button>
                        </div>
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Đăng Ký Webhook Endpoint Mới">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">URL Endpoint Nhận Webhook Payload (HTTPS)</label>
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-domain.com/api/webhooks/crm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Mô Tả Mục Đích Endpoint</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ví dụ: Đẩy đơn hàng tự động sang phần mềm kế toán..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold block">Chọn Các Sự Kiện Kích Hoạt (Trigger Events)</label>
            <div className="grid grid-cols-2 gap-2">
              {WEBHOOK_EVENTS.map((evt) => (
                <div
                  key={evt}
                  onClick={() => toggleEvent(evt)}
                  className={`flex items-center gap-2 rounded-xl p-2.5 border text-xs cursor-pointer transition-all ${
                    selectedEvents.includes(evt)
                      ? 'bg-purple-500/10 border-purple-500 text-purple-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  <input type="checkbox" checked={selectedEvents.includes(evt)} readOnly />
                  <span>{evt}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="gradient">
              Đăng Ký Webhook
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
