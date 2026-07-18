import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { DashboardLayoutShell } from './dashboard-layout-shell';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata: Metadata = {
  title: 'AI Sales CRM Dashboard | Production-Quality Hackathon Demo',
  description: 'Enterprise AI Sales CRM Dashboard built with Next.js 15, Recharts, Zustand & Mock Services.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className="dark">
      <body className={`${inter.className} antialiased bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200`}>
        <Providers>
          <DashboardLayoutShell>{children}</DashboardLayoutShell>
        </Providers>
      </body>
    </html>
  );
}
