'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ConversationService } from '@/services/repositories/ConversationService';
import { Conversation } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { GenericDataTable } from '@/components/tables/GenericDataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { MessageSquare, Sparkles, Send, Copy, AlertTriangle, ShieldCheck, CheckCircle2, User, Clock, Flame } from 'lucide-react';
import { getScoreColor, getStatusBadge } from '@/lib/utils';

export default function ConversationsPage() {
  const queryClient = useQueryClient();
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState('');

  const { data: convs = [], isLoading } = useQuery({
    queryKey: ['salesConversations'],
    queryFn: () => ConversationService.getAllConversations('sales-1'),
  });

  const sendMsgMutation = useMutation({
    mutationFn: ({ convId, text }: { convId: string; text: string }) =>
      ConversationService.sendMessage(convId, text, 'sales', 'Nguyễn Văn An'),
    onSuccess: (updatedConv) => {
      queryClient.invalidateQueries({ queryKey: ['salesConversations'] });
      setSelectedConv(updatedConv);
      setReplyText('');
    },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConv || !replyText.trim()) return;
    sendMsgMutation.mutate({ convId: selectedConv.id, text: replyText });
  };

  const columns: ColumnDef<Conversation>[] = [
    {
      accessorKey: 'customerName',
      header: 'Khách Hàng',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-html-element-suppression */}
          <img src={row.original.customerAvatar} alt={row.original.customerName} className="h-9 w-9 rounded-full border shrink-0" />
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">{row.original.customerName}</div>
            <div className="text-xs text-slate-400">{row.original.customerPhone}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'lastMessage',
      header: 'Tin Nhắn Mới Nhất',
      cell: ({ row }) => <span className="text-xs text-slate-400 max-w-xs truncate block">{row.original.lastMessage}</span>,
    },
    {
      accessorKey: 'score',
      header: 'Điểm AI (%)',
      cell: ({ row }) => {
        const score = row.original.score;
        const color = getScoreColor(score);
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${color.bg} ${color.text} ${color.border}`}>
            🔥 AI {score}%
          </span>
        );
      },
    },
    {
      accessorKey: 'sentiment',
      header: 'Cảm Xúc',
      cell: ({ row }) => (
        <Badge variant={row.original.sentiment === 'Positive' ? 'success' : row.original.sentiment === 'Neutral' ? 'warning' : 'danger'}>
          {row.original.sentiment}
        </Badge>
      ),
    },
    {
      accessorKey: 'intent',
      header: 'Ý Định Mua Hàng',
      cell: ({ row }) => <span className="text-xs font-semibold text-indigo-400">{row.original.intent}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Trạng Thái',
      cell: ({ row }) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(row.original.status)}`}>
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Hoạt Động Cuối',
    },
    {
      id: 'actions',
      header: 'Chi Tiết AI',
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedConv(row.original)}
          className="h-8 text-xs flex items-center gap-1"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> Mở Drawer AI
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-indigo-500" /> Phân Tích Cuộc Hội Thoại & AI Lead Score
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            2.000 cuộc hội thoại mock data được chấm điểm ý định mua hàng & phân tích cảm xúc
          </p>
        </div>
      </div>

      <GenericDataTable columns={columns} data={convs} isLoading={isLoading} searchPlaceholder="Tìm tên khách hàng, nội dung tin nhắn, số điện thoại..." />

      {/* Conversation Detail Modal / Drawer */}
      {selectedConv && (
        <Dialog
          isOpen={!!selectedConv}
          onClose={() => setSelectedConv(null)}
          title={`Hội Thoại AI: ${selectedConv.customerName}`}
          description={`Điểm chốt đơn: ${selectedConv.score}% • Sale phụ trách: ${selectedConv.assignedSalesName}`}
          className="max-w-4xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Chat History Simulator */}
            <div className="md:col-span-2 flex flex-col h-[500px] rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/90">
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {selectedConv.chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'sales'
                        ? 'items-end'
                        : msg.sender === 'ai'
                        ? 'items-center'
                        : 'items-start'
                    }`}
                  >
                    {msg.sender === 'ai' ? (
                      <div className="w-full my-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 p-3 text-xs text-indigo-300">
                        <span className="font-bold flex items-center gap-1 text-indigo-400 mb-1">
                          <Sparkles className="h-3.5 w-3.5" /> {msg.senderName}
                        </span>
                        {msg.message}
                      </div>
                    ) : (
                      <div
                        className={`max-w-[80%] rounded-2xl p-3 text-xs shadow-sm ${
                          msg.sender === 'sales'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="font-bold mb-1 opacity-80 text-[10px]">{msg.senderName} • {msg.timestamp}</div>
                        <div>{msg.message}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSend} className="mt-3 flex gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <Input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Nhập phản hồi gửi tới khách hàng..."
                  className="flex-1"
                />
                <Button type="submit" variant="gradient" className="h-10 px-4">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>

            {/* Right: AI Insights Sidebar */}
            <div className="space-y-4 text-xs">
              {/* Score & Risk Badge */}
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-400">Khả Năng Chốt Đơn</span>
                  <span className="text-base font-extrabold text-indigo-400">{selectedConv.score}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Mức Độ Rủi Ro (Risk)</span>
                  <Badge variant={selectedConv.riskLevel === 'Low' ? 'success' : selectedConv.riskLevel === 'Medium' ? 'warning' : 'danger'}>
                    {selectedConv.riskLevel} Risk
                  </Badge>
                </div>
              </div>

              {/* AI Summary */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-500" /> Tóm Tắt AI Summary
                </h4>
                <p className="text-slate-400 leading-relaxed">{selectedConv.aiSummary}</p>
              </div>

              {/* Suggested Reply & Copy */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Đề Xuất Phản Hồi (AI Suggested Reply)
                </h4>
                <p className="text-slate-300 italic bg-slate-900/50 p-2.5 rounded-xl border border-slate-700">
                  &ldquo;Dạ Jemmia sẵn sàng áp dụng voucher ưu đãi 5,000,000đ cho viên kim cương GIA 1ct nước D nếu chị chốt cọc giữ hàng hôm nay ạ!&rdquo;
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReplyText('Dạ Jemmia sẵn sàng áp dụng voucher ưu đãi 5,000,000đ cho viên kim cương GIA 1ct nước D nếu chị chốt cọc giữ hàng hôm nay ạ!');
                  }}
                  className="w-full text-[11px] h-8 flex items-center justify-center gap-1"
                >
                  <Copy className="h-3.5 w-3.5" /> Dùng Mẫu Trả Lời Này
                </Button>
              </div>

              {/* Recommended Next Action */}
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-1.5">
                <h4 className="font-bold text-blue-400 flex items-center gap-1.5">
                  🎯 Hành Động Tiếp Theo
                </h4>
                <p className="text-slate-300">{selectedConv.nextAction}</p>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
