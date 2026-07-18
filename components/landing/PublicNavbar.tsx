'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useThemeStore } from '@/hooks/useThemeStore';
import { Moon, Sun, Sparkles, ArrowRight, Menu, X, Code2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PublicNavbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Trang Chủ', href: '/#home' },
    { label: 'Tính Năng', href: '/#features' },
    { label: 'Giải Pháp', href: '/#solutions' },
    { label: 'Bảng Giá', href: '/#pricing' },
    { label: 'API Docs', href: '/docs' },
    { label: 'Hỏi Đáp (FAQ)', href: '/#faq' },
    { label: 'Liên Hệ', href: '/#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-rose-500 shadow-md shadow-indigo-500/20 text-white font-black text-xl">
            AI
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold bg-gradient-to-r from-blue-600 via-indigo-500 to-rose-500 bg-clip-text text-transparent">
              AI Sales CRM
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Commercial SaaS</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isDocs = link.href === '/docs' && pathname === '/docs';
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isDocs
                    ? 'text-indigo-500 font-bold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="rounded-xl border border-slate-200/80 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title="Đổi Giao Diện"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
          </button>

          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-sm font-medium">
              Đăng Nhập
            </Button>
          </Link>

          <Link href="/login">
            <Button variant="gradient" size="sm" className="flex items-center gap-1.5 font-bold shadow-md">
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="rounded-xl p-2 text-slate-600 dark:text-slate-300"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl p-2 text-slate-600 dark:text-slate-300"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 hover:text-indigo-500 dark:text-slate-200 py-1"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center">
                Đăng Nhập
              </Button>
            </Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="gradient" className="w-full justify-center">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
