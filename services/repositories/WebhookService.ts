import { WebhookEndpoint } from '@/types';
import { getItem, setItem, KEYS } from '@/lib/storage';
import { INITIAL_WEBHOOKS } from '@/services/mock/mockApiData';

export class WebhookService {
  private static async delay(ms = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async getWebhooks(companyId = 'comp-1'): Promise<WebhookEndpoint[]> {
    await this.delay();
    const items = getItem<WebhookEndpoint[]>(KEYS.WEBHOOKS, INITIAL_WEBHOOKS);
    return items.filter((w) => w.companyId === companyId);
  }

  static async createWebhook(url: string, events: string[], description = '', companyId = 'comp-1'): Promise<WebhookEndpoint> {
    await this.delay(400);
    const items = getItem<WebhookEndpoint[]>(KEYS.WEBHOOKS, INITIAL_WEBHOOKS);
    const randomHex = Math.random().toString(16).substring(2, 18);
    const newWh: WebhookEndpoint = {
      id: `wh-${Date.now()}`,
      companyId,
      url,
      events,
      secret: `whsec_${companyId}_${randomHex}`,
      status: 'Active',
      description,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newWh, ...items];
    setItem(KEYS.WEBHOOKS, updated);
    return newWh;
  }

  static async deleteWebhook(id: string): Promise<boolean> {
    await this.delay(300);
    const items = getItem<WebhookEndpoint[]>(KEYS.WEBHOOKS, INITIAL_WEBHOOKS);
    const filtered = items.filter((w) => w.id !== id);
    setItem(KEYS.WEBHOOKS, filtered);
    return true;
  }
}
