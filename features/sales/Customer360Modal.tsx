'use client';

import React from 'react';
import { Customer } from '@/types';
import { Dialog } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MOCK_TIMELINE_EVENTS } from '@/services/mock/mockData';
import { formatFullVND } from '@/lib/utils';
import { Phone, Mail, MapPin, Calendar, Sparkles, ShoppingBag, Clock, CheckCircle2 } from 'lucide-react';

interface Customer360ModalProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
}

export function Customer360Modal({ customer, isOpen, onClose }: Customer360ModalProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-5xl"
    >
      <div className="space-y-6">
        {/* Top Profile Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-blue-600/10 border border-purple-500/20 gap-4">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-html-element-suppression */}
            <img src={customer.avatar} alt={customer.name} className="h-16 w-16 rounded-full border-2 border-purple-500" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{customer.name}</h3>
                <Badge variant="danger">{customer.tier}</Badge>
              </div>
              <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3 mt-1">
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {customer.phone}</span>
                <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {customer.email}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {customer.city}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Sinh nhật: {customer.birthday}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Tổng Chi Tiêu</span>
            <span className="text-xl font-black text-emerald-500">{formatFullVND(customer.totalSpent)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: AI Summary & Recommended Products */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-500" /> Đánh Giá Khách Hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-slate-300">
                <p className="leading-relaxed">
                  Khách hàng <span className="font-bold text-white">{customer.name}</span> có thói quen chốt mua sản phẩm trang sức kim cương tự nhiên vào dịp kỷ niệm ngày cưới tháng 7. Thái độ tương tác thân thiện, ưu tiên các mẫu kiểm định GIA.
                </p>
                <div className="pt-2 border-t border-slate-800">
                  <span className="font-bold text-indigo-400 block mb-1">Gợi Ý Sản Phẩm Cross-Sell:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline">Bộ Dây Chuyền Kim Cương 4ly</Badge>
                    <Badge variant="outline">Lắc Tay Vàng Trắng 18k</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <ShoppingBag className="h-4 w-4 text-blue-500" /> Sản Phẩm Quan Tâm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="text-xs">{customer.favoriteProduct}</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Right: Customer Journey Timeline */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-indigo-500" /> Hành Trình Khách Hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {MOCK_TIMELINE_EVENTS.map((evt) => (
                    <div key={evt.id} className="relative text-xs">
                      <div className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                        <CheckCircle2 className="h-3 w-3" />
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                        <span>{evt.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{evt.date}</span>
                      </div>
                      <p className="text-slate-400 mt-0.5">{evt.description}</p>
                      <span className="text-[10px] text-indigo-400 mt-0.5 block">Sale thực hiện: {evt.salesOwner}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
