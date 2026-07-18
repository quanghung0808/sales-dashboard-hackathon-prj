import { KPIMetric, CommissionRule } from '@/types';
import { getItem, setItem, KEYS } from '@/lib/storage';
import { INITIAL_KPI_METRICS, INITIAL_COMMISSION_RULES } from '@/services/mock/mockData';

export class KPIService {
  private static async delay(ms = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async getKPIMetrics(): Promise<KPIMetric[]> {
    await this.delay();
    return getItem<KPIMetric[]>(KEYS.KPIS, INITIAL_KPI_METRICS);
  }

  static async saveKPIMetric(kpi: KPIMetric): Promise<KPIMetric> {
    await this.delay(400);
    const metrics = getItem<KPIMetric[]>(KEYS.KPIS, INITIAL_KPI_METRICS);
    const idx = metrics.findIndex((m) => m.id === kpi.id);
    if (idx >= 0) {
      metrics[idx] = kpi;
    } else {
      metrics.unshift(kpi);
    }
    setItem(KEYS.KPIS, metrics);
    return kpi;
  }

  static async getCommissionRules(): Promise<CommissionRule[]> {
    await this.delay();
    return getItem<CommissionRule[]>(KEYS.COMMISSION_RULES, INITIAL_COMMISSION_RULES);
  }

  static async saveCommissionRules(rules: CommissionRule[]): Promise<CommissionRule[]> {
    await this.delay(400);
    setItem(KEYS.COMMISSION_RULES, rules);
    return rules;
  }
}
