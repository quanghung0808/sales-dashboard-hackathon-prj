'use client';

import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingBag, MessageSquare, Building2, X } from 'lucide-react';
import { getItem, KEYS } from '@/lib/storage';
import { Customer, Order, Conversation, SalesRep } from '@/types';
import { formatVND, getScoreColor } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    customers: Customer[];
    orders: Order[];
    conversations: Conversation[];
    sales: SalesRep[];
  }>({
    customers: [],
    orders: [],
    conversations: [],
    sales: [],
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ customers: [], orders: [], conversations: [], sales: [] });
      return;
    }

    const q = query.toLowerCase();
    const customers = getItem<Customer[]>(KEYS.CUSTOMERS, []).filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.city.toLowerCase().includes(q)
    ).slice(0, 4);

    const orders = getItem<Order[]>(KEYS.ORDERS, []).filter(
      (o) => o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.product.toLowerCase().includes(q)
    ).slice(0, 4);

    const conversations = getItem<Conversation[]>(KEYS.CONVERSATIONS, []).filter(
      (conv) => conv.customerName.toLowerCase().includes(q) || conv.aiSummary.toLowerCase().includes(q) || conv.nextAction.toLowerCase().includes(q)
    ).slice(0, 4);

    const sales = getItem<SalesRep[]>(KEYS.SALES, []).filter(
      (s) => s.name.toLowerCase().includes(q) || s.department.toLowerCase().includes(q)
    ).slice(0, 3);

    setResults({ customers, orders, conversations, sales });
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3.5 dark:border-slate-800">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            autoFocus
            type="text"
            placeholder="Tìm theo tên khách hàng, mã đơn hàng, sản phẩm, tin nhắn AI..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-base outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query.trim() && (
            <div className="py-8 text-center text-sm text-slate-400">
              Gõ từ khóa để tìm kiếm (Khách hàng, Đơn hàng, Hội thoại)
            </div>
          )}

          {/* Customers */}
          {results.customers.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                <User className="h-3.5 w-3.5" /> Khách Hàng ({results.customers.length})
              </div>
              <div className="space-y-1.5">
                {results.customers.map((cust) => (
                  <div
                    key={cust.id}
                    onClick={() => {
                      onClose();
                      router.push('/sales/customers');
                    }}
                    className="flex items-center justify-between rounded-xl p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-html-element-suppression */}
                      <img src={cust.avatar} alt={cust.name} className="h-8 w-8 rounded-full border" />
                      <div>
                        <div className="font-semibold text-sm">{cust.name}</div>
                        <div className="text-xs text-slate-400">{cust.phone} • {cust.city}</div>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-emerald-500">{formatVND(cust.totalSpent)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders */}
          {results.orders.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                <ShoppingBag className="h-3.5 w-3.5" /> Đơn Hàng ({results.orders.length})
              </div>
              <div className="space-y-1.5">
                {results.orders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => {
                      onClose();
                      router.push('/sales/orders');
                    }}
                    className="flex items-center justify-between rounded-xl p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-sm flex items-center gap-2">
                        <span>{ord.id}</span>
                        <span className="text-xs text-slate-400 font-normal">({ord.product})</span>
                      </div>
                      <div className="text-xs text-slate-400">Khách: {ord.customerName} • Sale: {ord.salesName}</div>
                    </div>
                    <span className="text-xs font-semibold">{formatVND(ord.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conversations */}
          {results.conversations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                <MessageSquare className="h-3.5 w-3.5" /> Hội Thoại AI ({results.conversations.length})
              </div>
              <div className="space-y-1.5">
                {results.conversations.map((conv) => {
                  const colors = getScoreColor(conv.score);
                  return (
                    <div
                      key={conv.id}
                      onClick={() => {
                        onClose();
                        router.push('/sales/conversations');
                      }}
                      className="flex items-center justify-between rounded-xl p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-sm">{conv.customerName}</div>
                        <div className="text-xs text-slate-400 line-clamp-1">{conv.aiSummary}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${colors.bg} ${colors.text} ${colors.border}`}>
                        AI {conv.score}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
