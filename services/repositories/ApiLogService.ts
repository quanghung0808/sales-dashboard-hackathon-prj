import { ApiLogItem } from '@/types';
import { getItem, setItem, KEYS } from '@/lib/storage';
import { INITIAL_API_LOGS } from '@/services/mock/mockApiData';

export class ApiLogService {
  private static async delay(ms = 200) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async getApiLogs(companyId = 'comp-1'): Promise<ApiLogItem[]> {
    await this.delay();
    const logs = getItem<ApiLogItem[]>(KEYS.API_LOGS, INITIAL_API_LOGS);
    return logs.filter((l) => l.companyId === companyId);
  }

  static async logRequest(log: Omit<ApiLogItem, 'id'>): Promise<ApiLogItem> {
    const logs = getItem<ApiLogItem[]>(KEYS.API_LOGS, INITIAL_API_LOGS);
    const newLog: ApiLogItem = {
      ...log,
      id: `log-${Date.now()}`,
      createdAt: log.createdAt || new Date().toLocaleString('sv-SE').replace('T', ' '),
    };
    const updated = [newLog, ...logs].slice(0, 100);
    setItem(KEYS.API_LOGS, updated);
    return newLog;
  }
}
