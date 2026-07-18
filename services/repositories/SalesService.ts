import { SalesRep } from '@/types';
import { getItem, setItem, KEYS } from '@/lib/storage';
import { generateMockSales } from '@/services/mock/mockData';

export class SalesService {
  private static async delay(ms = 350) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async getAllSales(companyId?: string): Promise<SalesRep[]> {
    await this.delay();
    const sales = getItem<SalesRep[]>(KEYS.SALES, []);
    if (!sales.length) {
      const fallback = generateMockSales();
      setItem(KEYS.SALES, fallback);
      return companyId ? fallback.filter((s) => s.companyId === companyId) : fallback;
    }
    return companyId ? sales.filter((s) => s.companyId === companyId) : sales;
  }

  static async getSalesById(id: string): Promise<SalesRep | null> {
    await this.delay();
    const sales = await this.getAllSales();
    return sales.find((s) => s.id === id) || null;
  }

  static async createSales(data: Omit<SalesRep, 'id' | 'revenue' | 'kpiAchieved' | 'commission' | 'activeLeadsCount'>): Promise<SalesRep> {
    await this.delay(500);
    const sales = getItem<SalesRep[]>(KEYS.SALES, []);
    const newSales: SalesRep = {
      ...data,
      id: `sales-${Date.now()}`,
      revenue: 0,
      kpiAchieved: 0,
      commission: 0,
      activeLeadsCount: 0,
    };
    const updated = [newSales, ...sales];
    setItem(KEYS.SALES, updated);
    return newSales;
  }

  static async updateSales(id: string, data: Partial<SalesRep>): Promise<SalesRep> {
    await this.delay(400);
    const sales = getItem<SalesRep[]>(KEYS.SALES, []);
    const index = sales.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Sales rep not found');

    const updated = { ...sales[index], ...data };
    sales[index] = updated;
    setItem(KEYS.SALES, sales);
    return updated;
  }

  static async deleteSales(id: string): Promise<boolean> {
    await this.delay(400);
    const sales = getItem<SalesRep[]>(KEYS.SALES, []);
    const filtered = sales.filter((s) => s.id !== id);
    setItem(KEYS.SALES, filtered);
    return true;
  }
}
