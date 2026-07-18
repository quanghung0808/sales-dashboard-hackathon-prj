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
import { MessageSquare, Sparkles, Send, Eye } from 'lucide-react';

export default function ConversationsPage() {
  const queryClient = useQueryClient();
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState('');

  const { data: convs = [], isLoading } = useQuery({
    queryKey: ['salesConversationsAll'],
    queryFn: () => ConversationService.getAllConversations(),
  });

  const sendMsgMutation = useMutation({
    mutationFn: ({ convId, text }: { convId: string; text: string }) =>
      ConversationService.sendMessage(convId, text, 'sales', 'Nguyễn Văn An'),
    onSuccess: (updatedConv) => {
      queryClient.invalidateQueries({ queryKey: ['salesConversationsAll'] });
      setSelectedConv(updatedConv);
      setReplyText('');
    },
  });

  const handleSend = (textToSend?: string) => {
    const text = textToSend || replyText;
    if (!selectedConv || !text.trim()) return;
    sendMsgMutation.mutate({ convId: selectedConv.id, text });
  };

  const getSentimentByScore = (score: number) => {
    if (score < 29) return { label: 'Negative', variant: 'danger' as const, bg: 'bg-rose-500/10 text-rose-500 border-rose-500/30' };
    if (score <= 69) return { label: 'Neutral', variant: 'warning' as const, bg: 'bg-amber-500/10 text-amber-500 border-amber-500/30' };
    return { label: 'Positive', variant: 'success' as const, bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' };
  };

  const getIntentByScore = (score: number) => {
    if (score >= 85) return 'Quyết định mua';
    if (score >= 70) return 'Cân nhắc mua';
    if (score >= 50) return 'Hỏi thông tin sản phẩm';
    if (score >= 30) return 'Hỏi giá';
    return 'Không có nhu cầu';
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
      accessorKey: 'score',
      header: 'Điểm AI (%)',
      cell: ({ row }) => {
        const score = row.original.score;
        const sent = getSentimentByScore(score);
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${sent.bg}`}>
            AI {score}%
          </span>
        );
      },
    },
    {
      accessorKey: 'sentiment',
      header: 'Cảm Xúc',
      cell: ({ row }) => {
        const sent = getSentimentByScore(row.original.score);
        return (
          <Badge variant={sent.variant}>
            {sent.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'intent',
      header: 'Ý Định Mua Hàng',
      cell: ({ row }) => (
        <span className="text-xs font-semibold text-indigo-500 dark:text-indigo-400">
          {getIntentByScore(row.original.score)}
        </span>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Hoạt Động Cuối',
    },
    {
      id: 'actions',
      header: 'Chi Tiết',
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedConv(row.original)}
          className="h-8 text-xs flex items-center gap-1 font-bold"
        >
          <Eye className="h-3.5 w-3.5 text-indigo-500" /> Chi Tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-indigo-500" /> Hội Thoại
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Quản lý và tư vấn các cuộc hội thoại khách hàng với phân tích AI Score & Cảm Xúc
          </p>
        </div>
      </div>

      <GenericDataTable columns={columns} data={convs} isLoading={isLoading} searchPlaceholder="Tìm tên khách hàng, số điện thoại..." />

      {/* Conversation Detail Dialog */}
      {selectedConv && (
        <Dialog
          isOpen={!!selectedConv}
          onClose={() => setSelectedConv(null)}
          title={`Hội Thoại AI: ${selectedConv.customerName}`}
          className="max-w-4xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Chat History Simulator */}
            <div className="md:col-span-2 flex flex-col h-[500px] rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/90">
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {selectedConv.chatHistory
                  .filter((m) => m.sender !== 'ai')
                  .map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === 'sales' ? 'items-end' : 'items-start'
                      }`}
                    >
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
                    </div>
                  ))}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="mt-3 flex gap-2 pt-3 border-t border-slate-200 dark:border-slate-800"
              >
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
              {/* AI Score */}
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-400">Khả Năng Chốt Đơn (AI Score)</span>
                  <span className="text-base font-extrabold text-indigo-400">{selectedConv.score}%</span>
                </div>
              </div>

              {/* AI Summary Section (Includes AI Assistant Message) */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-500" /> Tóm Tắt AI Summary
                </h4>
                <p className="text-slate-400 leading-relaxed">{selectedConv.aiSummary}</p>

                <div className="pt-2 border-t border-slate-700 text-[11px] text-indigo-300">
                  <span className="font-bold text-indigo-400 block mb-0.5">AI Sales Assistant:</span>
                  Khách hàng đang ưu tiên tư vấn kim cương GIA tự nhiên nước D, thời gian chốt đơn dự kiến trong 3 ngày.
                </div>
              </div>

              {/* Suggested Reply & Direct Send */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                  💡 Mẫu Phản Hồi AI Gợi Ý
                </h4>
                <p className="text-slate-300 italic bg-slate-900/50 p-2.5 rounded-xl border border-slate-700">
                  &ldquo;Dạ Jemmia sẵn sàng áp dụng voucher ưu đãi 5,000,000đ cho viên kim cương GIA 1ct nước D nếu chị chốt cọc giữ hàng hôm nay ạ!&rdquo;
                </p>
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={() => {
                    handleSend('Dạ Jemmia sẵn sàng áp dụng voucher ưu đãi 5,000,000đ cho viên kim cương GIA 1ct nước D nếu chị chốt cọc giữ hàng hôm nay ạ!');
                  }}
                  className="w-full text-[11px] h-8 flex items-center justify-center gap-1 font-bold"
                >
                  <Send className="h-3.5 w-3.5" /> Sử dụng Mẫu hội thoại này
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
