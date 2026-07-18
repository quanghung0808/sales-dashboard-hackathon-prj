'use client';

import React, { useState } from 'react';
import { Conversation } from '@/types';
import { Dialog } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getScoreColor, formatVND } from '@/lib/utils';
import { Sparkles, Send, Bot, User, MessageSquare } from 'lucide-react';

interface ChatSimulatorDrawerProps {
  conversation: Conversation;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatSimulatorDrawer({ conversation, isOpen, onClose }: ChatSimulatorDrawerProps) {
  const [messages, setMessages] = useState(conversation.chatHistory);
  const [inputMsg, setInputMsg] = useState('');
  const colors = getScoreColor(conversation.score);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'sales' as const,
      senderName: conversation.assignedSalesName,
      message: inputMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMsg]);
    setInputMsg('');
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Hội Thoại AI Sales Copilot: ${conversation.customerName}`}
      description={`Điểm số AI Intent: ${conversation.score}% • Phân hạng ${conversation.sentiment}`}
      className="max-w-4xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Chat Simulator */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-80 overflow-y-auto p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs ${
                  msg.sender === 'sales'
                    ? 'justify-end'
                    : msg.sender === 'ai'
                    ? 'justify-center'
                    : 'justify-start'
                }`}
              >
                {msg.sender === 'ai' ? (
                  <div className="p-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[11px] max-w-md text-center">
                    {msg.message}
                  </div>
                ) : (
                  <div
                    className={`p-3 rounded-2xl max-w-sm space-y-1 ${
                      msg.sender === 'sales'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-800 text-slate-100 rounded-bl-none'
                    }`}
                  >
                    <div className="font-bold text-[10px] opacity-75">{msg.senderName} • {msg.timestamp}</div>
                    <p className="leading-relaxed">{msg.message}</p>
                  </div>
                )}
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
                <Sparkles className="h-4 w-4" /> AI Summary Insight
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-slate-300">
              <p className="leading-relaxed">{conversation.aiSummary}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                💡 Gợi Ý Câu Phản Hồi AI (Suggested Reply)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <p className="text-slate-300 italic">&ldquo;{conversation.nextAction}&rdquo;</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputMsg(conversation.nextAction)}
                className="w-full text-[11px] font-bold text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
              >
                Chèn Câu Trả Lời Gợi Ý
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Dialog>
  );
}
