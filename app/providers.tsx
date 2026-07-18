'use client';

import React, { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { initLocalStorageMockData } from '@/lib/storage';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useNotificationStore } from '@/hooks/useNotificationStore';
import { useThemeStore } from '@/hooks/useThemeStore';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const initAuth = useAuthStore((state) => state.initAuth);
  const initNotifications = useNotificationStore((state) => state.initNotifications);
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    initLocalStorageMockData();
    initAuth();
    initNotifications();
    initTheme();
    setMounted(true);
  }, [initAuth, initNotifications, initTheme]);

  if (!mounted) return null;

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
