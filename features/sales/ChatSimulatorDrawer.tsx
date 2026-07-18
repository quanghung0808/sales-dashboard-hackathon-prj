'use client';

import React, { useState } from 'react';
import { Conversation } from '@/types';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sparkles, Send } from 'lucide-react';

interface ChatSimulatorDrawerProps {
  conversation: Conversation;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatSimulatorDrawer({ conversation, isOpen, onClose }: ChatSimulatorDrawerProps) {
  const [messages, setMessages] = useState(
    conversation.chatHistory.filter((m) => m.sender !== 'ai')
  );
  const [inputMsg, setInputMsg] = useState('');

  const sendDirectMessage = (text: string) => {
    if (!text.trim()) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'sales' as const,
      senderName: conversation.assignedSalesName || 'Nguyễn Văn An',
      message: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendDirectMessage(inputMsg);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Hội Thoại AI: ${conversation.customerName}`}
      className="max-w-4xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Chat Simulator */}
        <div className="lg:col-span-2 flex flex-col h-96 space-y-3">
          <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex text-xs ${
                  msg.sender === 'sales' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-sm space-y-1 ${
                    msg.sender === 'sales'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
                  }`}
                >
                  <div className="font-bold text-[10px] opacity-75">{msg.senderName} • {msg.timestamp}</div>
                  <p className="leading-relaxed">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Nhập tin nhắn tư vấn gửi cho khách hàng..."
              className="flex-1 rounded-xl border border-slate-300 bg-white px-4 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
            <Button type="submit" variant="gradient" className="h-10 px-4">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Right: AI Summary & Suggested Reply */}
        <div className="space-y-4">
          <Card className="border-l-4 border-l-indigo-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" /> Tóm Tắt AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-slate-300">
              <p className="leading-relaxed">{conversation.aiSummary}</p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-indigo-300">
                <span className="font-bold text-indigo-400 block mb-0.5">AI Sales Assistant:</span>
                Khách hàng quan tâm cao dòng nhẫn kim cương GIA 1ct, sẵn sàng chốt đơn khi nhận báo giá chi tiết.
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                💡 Mẫu Phản Hồi AI Gợi Ý
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <p className="text-slate-300 italic bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                &ldquo;Dạ Jemmia sẵn sàng áp dụng voucher ưu đãi 5,000,000đ cho viên kim cương GIA 1ct nước D nếu chị chốt cọc giữ hàng hôm nay ạ!&rdquo;
              </p>
              <Button
                variant="gradient"
                size="sm"
                onClick={() => {
                  sendDirectMessage('Dạ Jemmia sẵn sàng áp dụng voucher ưu đãi 5,000,000đ cho viên kim cương GIA 1ct nước D nếu chị chốt cọc giữ hàng hôm nay ạ!');
                }}
                className="w-full text-[11px] font-bold h-8 flex items-center justify-center gap-1"
              >
                <Send className="h-3.5 w-3.5" /> Sử dụng Mẫu hội thoại này
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Dialog>
  );
}
