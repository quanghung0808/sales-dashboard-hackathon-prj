'use client';

import React, { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { MockAIService } from '@/services/mock/mockAIService';
import { Sparkles, CheckCircle2, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DailyAISummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DailyAISummaryModal({ isOpen, onClose }: DailyAISummaryModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      MockAIService.generateDailySummary('Nguyễn Văn An', 4, 145000000).then((res) => {
        setData(res);
        setLoading(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="🤖 Báo Cáo AI Daily Sales Summary (6:00 PM)"
      description="Tổng hợp tự động hiệu suất kinh doanh trong ngày bởi AI Assistant"
      className="max-w-2xl"
    >
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-3">
          <Sparkles className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-sm text-slate-400">AI đang phân tích cuộc gọi, đơn hàng và lịch sử trò chuyện hôm nay...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Badge */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-rose-500/10 border border-indigo-500/20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                92
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Điểm Hiệu Suất Ngày: 92/100</h4>
                <p className="text-xs text-slate-400">Đã chốt {data.ordersClosed} đơn hàng • {data.customersContacted} khách hàng tương tác</p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
              Xuất Sắc 🔥
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-[11px] text-slate-400 block">Doanh Thu Hôm Nay</span>
              <span className="text-base font-bold text-emerald-500">{data.revenueToday}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-[11px] text-slate-400 block">Đơn Hoàn Tất</span>
              <span className="text-base font-bold text-blue-500">{data.ordersClosed} đơn</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-[11px] text-slate-400 block">Khách Tương Tác</span>
              <span className="text-base font-bold text-purple-500">{data.customersContacted} khách</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-[11px] text-slate-400 block">Cuộc Gọi Bỏ Dở</span>
              <span className="text-base font-bold text-rose-400">{data.missedFollowups} cuộc</span>
            </div>
          </div>

          {/* AI Insights */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-blue-500" /> Nhận Xét & Phân Tích AI
            </h4>
            <div className="space-y-1.5">
              {data.insights.map((ins: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{ins}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tomorrow Actions */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-amber-500" /> Đề Xuất Ưu Tiên Cho Ngày Mai
            </h4>
            <div className="space-y-1.5">
              {data.tomorrowSuggestions.map((sug: string, idx: number) => (
                <div key={idx} className="text-xs text-slate-200 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 font-medium">
                  {sug}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="gradient" onClick={onClose}>
              Đã Hiểu & Đóng Báo Cáo
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
