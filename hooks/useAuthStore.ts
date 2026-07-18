import { create } from 'zustand';
import { User, UserRole } from '@/types';
import { getItem, setItem, KEYS } from '@/lib/storage';

interface AuthState {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  loginAs: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  initAuth: () => void;
}

const PRESET_USERS: Record<UserRole, User> = {
  super_admin: {
    id: 'user-sa',
    name: 'Vũ Thanh Long',
    email: 'superadmin@crm.vn',
    role: 'super_admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SuperAdmin',
  },
  company_admin: {
    id: 'user-ca',
    name: 'Nguyễn Thanh Tùng',
    email: 'tung.nguyen@jemmia.vn',
    role: 'company_admin',
    companyId: 'comp-1',
    companyName: 'Jemmia Diamond',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TungAdmin',
  },
  sales: {
    id: 'sales-1',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@jemmia.vn',
    role: 'sales',
    companyId: 'comp-1',
    companyName: 'Jemmia Diamond',
    department: 'VIP Consultation',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NguyenVanAn',
  },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: PRESET_USERS.sales,
  role: 'sales',
  isAuthenticated: true,

  initAuth: () => {
    if (typeof window === 'undefined') return;
    const savedUser = getItem<User | null>(KEYS.CURRENT_USER, null);
    if (savedUser) {
      set({ user: savedUser, role: savedUser.role, isAuthenticated: true });
    } else {
      setItem(KEYS.CURRENT_USER, PRESET_USERS.sales);
      set({ user: PRESET_USERS.sales, role: 'sales', isAuthenticated: true });
    }
  },

  loginAs: (role: UserRole) => {
    const user = PRESET_USERS[role];
    setItem(KEYS.CURRENT_USER, user);
    set({ user, role, isAuthenticated: true });
  },

  switchRole: (role: UserRole) => {
    const user = PRESET_USERS[role];
    setItem(KEYS.CURRENT_USER, user);
    set({ user, role, isAuthenticated: true });
  },

  logout: () => {
    setItem(KEYS.CURRENT_USER, null);
    set({ user: null, role: 'sales', isAuthenticated: false });
  },
}));
