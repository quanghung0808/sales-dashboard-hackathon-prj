'use client';

import React, { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Sparkles, CheckCircle2, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DailyAISummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DailyAISummaryModal({ isOpen, onClose }: DailyAISummaryModalProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const data = {
    performanceScore: 94,
    revenueToday: '270.000.000đ',
    ordersClosed: 2,
    customersContacted: 6,
    missedFollowups: 1,
    insights: [
      '🔥 Tỷ lệ chốt đơn kim cương nước D đạt mức ấn tượng 94% nhờ tốc độ phản hồi < 2 phút.',
      '💍 Khách hàng quan tâm nhiều nhất đến phân khúc nhẫn cưới vàng trắng 18k và kim cương 1ct GIA.',
      '⚠️ Cần chú ý theo dõi 1 đơn hàng cọc đang chờ chuyển khoản trước 18:00.',
    ],
    tomorrowSuggestions: [
      '🔥 Gọi điện tư vấn Nguyễn Văn A: Khách quan tâm nhẫn 1ct chưa liên hệ lại >3 ngày.',
      '📩 Gửi báo giá cho Lan Anh: Khách yêu cầu gửi bảng chiết khấu nhẫn cưới hôm qua.',
      '💰 Xác nhận đơn hàng #ORD-2032: Đơn hàng đang chờ cọc >2 ngày.',
      '🎂 Chúc mừng sinh nhật Phạm Minh Tuấn: Sinh nhật khách VIP hôm nay - Gửi voucher tri ân.',
    ],
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="📊 Báo Cáo AI Sales Brief (18:00)"
      description="Tổng hợp tự động hiệu suất tư vấn và doanh số trong ngày bởi AI Assistant"
      className="max-w-2xl"
    >
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-3">
          <Sparkles className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-sm text-slate-400">AI đang tóm tắt báo cáo doanh số hôm nay...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Badge */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-rose-500/10 border border-indigo-500/20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                {data.performanceScore}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Điểm Hiệu Suất Ngày: {data.performanceScore}/100</h4>
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
              <span className="text-[11px] text-slate-400 block">Cần Chăm Sóc Lại</span>
              <span className="text-base font-bold text-amber-500">{data.missedFollowups} khách</span>
            </div>
          </div>

          {/* AI Insights */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-blue-500" /> Nhận Xét & Phân Tích AI
            </h4>
            <div className="space-y-1.5">
              {data.insights.map((ins: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
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
                <div key={idx} className="text-xs text-amber-900 dark:text-amber-200 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 font-medium">
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
