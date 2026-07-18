import { AISettings, CompanyAdmin } from '@/types';
import { getItem, setItem, KEYS } from '@/lib/storage';
import { INITIAL_AI_SETTINGS, INITIAL_ADMINS } from '@/services/mock/mockData';

export class SettingsService {
  private static async delay(ms = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async getAISettings(): Promise<AISettings> {
    await this.delay();
    return getItem<AISettings>(KEYS.AI_SETTINGS, INITIAL_AI_SETTINGS);
  }

  static async updateAISettings(settings: Partial<AISettings>): Promise<AISettings> {
    await this.delay(400);
    const current = await this.getAISettings();
    const updated = { ...current, ...settings };
    setItem(KEYS.AI_SETTINGS, updated);
    return updated;
  }

  static async getAdmins(): Promise<CompanyAdmin[]> {
    await this.delay();
    return getItem<CompanyAdmin[]>(KEYS.ADMINS, INITIAL_ADMINS);
  }

  static async createAdmin(admin: Omit<CompanyAdmin, 'id' | 'createdAt'>): Promise<CompanyAdmin> {
    await this.delay(500);
    const admins = await this.getAdmins();
    const newAdmin: CompanyAdmin = {
      ...admin,
      id: `admin-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setItem(KEYS.ADMINS, [newAdmin, ...admins]);
    return newAdmin;
  }

  static async deleteAdmin(id: string): Promise<boolean> {
    await this.delay(400);
    const admins = await this.getAdmins();
    const filtered = admins.filter(a => a.id !== id);
    setItem(KEYS.ADMINS, filtered);
    return true;
  }
}
