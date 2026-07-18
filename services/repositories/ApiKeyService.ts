import { ApiKey } from '@/types';
import { getItem, setItem, KEYS } from '@/lib/storage';
import { INITIAL_API_KEYS } from '@/services/mock/mockApiData';

export class ApiKeyService {
  private static async delay(ms = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async getApiKeys(companyId = 'comp-1'): Promise<ApiKey[]> {
    await this.delay();
    const keys = getItem<ApiKey[]>(KEYS.API_KEYS, INITIAL_API_KEYS);
    return keys.filter((k) => k.companyId === companyId);
  }

  static async createApiKey(name: string, companyId = 'comp-1', createdBy = 'Nguyễn Thanh Tùng'): Promise<ApiKey> {
    await this.delay(400);
    const keys = getItem<ApiKey[]>(KEYS.API_KEYS, INITIAL_API_KEYS);
    const companyPrefix = companyId.replace('comp-', '');
    const randomHex = Math.random().toString(16).substring(2, 18);
    const keyString = `sak_live_${companyPrefix}_${randomHex}`;

    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      companyId,
      name,
      key: keyString,
      status: 'Active',
      createdBy,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsedAt: null,
      rateLimit: 100,
    };

    const updated = [newKey, ...keys];
    setItem(KEYS.API_KEYS, updated);
    return newKey;
  }

  static async regenerateApiKey(id: string): Promise<ApiKey> {
    await this.delay(400);
    const keys = getItem<ApiKey[]>(KEYS.API_KEYS, INITIAL_API_KEYS);
    const index = keys.findIndex((k) => k.id === id);
    if (index === -1) throw new Error('API Key not found');

    const k = keys[index];
    const companyPrefix = k.companyId.replace('comp-', '');
    const randomHex = Math.random().toString(16).substring(2, 18);
    k.key = `sak_live_${companyPrefix}_${randomHex}`;
    k.createdAt = new Date().toISOString().split('T')[0];

    keys[index] = k;
    setItem(KEYS.API_KEYS, keys);
    return k;
  }

  static async toggleApiKeyStatus(id: string): Promise<ApiKey> {
    await this.delay(300);
    const keys = getItem<ApiKey[]>(KEYS.API_KEYS, INITIAL_API_KEYS);
    const index = keys.findIndex((k) => k.id === id);
    if (index === -1) throw new Error('API Key not found');

    keys[index].status = keys[index].status === 'Active' ? 'Disabled' : 'Active';
    setItem(KEYS.API_KEYS, keys);
    return keys[index];
  }

  static async deleteApiKey(id: string): Promise<boolean> {
    await this.delay(300);
    const keys = getItem<ApiKey[]>(KEYS.API_KEYS, INITIAL_API_KEYS);
    const filtered = keys.filter((k) => k.id !== id);
    setItem(KEYS.API_KEYS, filtered);
    return true;
  }
}
