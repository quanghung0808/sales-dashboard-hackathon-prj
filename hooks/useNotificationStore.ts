import { create } from 'zustand';
import { NotificationItem } from '@/types';
import { getItem, setItem, KEYS } from '@/lib/storage';
import { INITIAL_NOTIFICATIONS } from '@/services/mock/mockData';

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  initNotifications: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: INITIAL_NOTIFICATIONS,
  unreadCount: INITIAL_NOTIFICATIONS.filter((n) => !n.read).length,

  initNotifications: () => {
    if (typeof window === 'undefined') return;
    const items = getItem<NotificationItem[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    set({
      notifications: items,
      unreadCount: items.filter((n) => !n.read).length,
    });
  },

  markAsRead: (id: string) => {
    const updated = get().notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setItem(KEYS.NOTIFICATIONS, updated);
    set({
      notifications: updated,
      unreadCount: updated.filter((n) => !n.read).length,
    });
  },

  markAllAsRead: () => {
    const updated = get().notifications.map((n) => ({ ...n, read: true }));
    setItem(KEYS.NOTIFICATIONS, updated);
    set({ notifications: updated, unreadCount: 0 });
  },

  addNotification: (item) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      timestamp: 'Vừa xong',
      read: false,
    };
    const updated = [newNotif, ...get().notifications];
    setItem(KEYS.NOTIFICATIONS, updated);
    set({
      notifications: updated,
      unreadCount: updated.filter((n) => !n.read).length,
    });
  },
}));
