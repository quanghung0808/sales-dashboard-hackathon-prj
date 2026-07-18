import { create } from 'zustand';
import { getItem, setItem, KEYS } from '@/lib/storage';

interface ThemeState {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'dark',

  initTheme: () => {
    if (typeof window === 'undefined') return;
    const savedTheme = getItem<'dark' | 'light'>(KEYS.THEME, 'dark');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme: savedTheme });
  },

  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setItem(KEYS.THEME, nextTheme);
    set({ theme: nextTheme });
  },
}));
