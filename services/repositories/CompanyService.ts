import { Company } from '@/types';
import { getItem, setItem, KEYS } from '@/lib/storage';
import { INITIAL_COMPANIES } from '@/services/mock/mockData';

export class CompanyService {
  private static async delay(ms = 350) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async getAllCompanies(): Promise<Company[]> {
    await this.delay();
    return getItem<Company[]>(KEYS.COMPANIES, INITIAL_COMPANIES);
  }

  static async getCompanyById(id: string): Promise<Company | null> {
    await this.delay();
    const companies = getItem<Company[]>(KEYS.COMPANIES, INITIAL_COMPANIES);
    return companies.find((c) => c.id === id) || null;
  }

  static async createCompany(data: Omit<Company, 'id' | 'createdAt' | 'salesCount' | 'totalRevenue'>): Promise<Company> {
    await this.delay(500);
    const companies = getItem<Company[]>(KEYS.COMPANIES, INITIAL_COMPANIES);
    const newCompany: Company = {
      ...data,
      id: `comp-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      salesCount: 0,
      totalRevenue: 0,
    };
    const updated = [newCompany, ...companies];
    setItem(KEYS.COMPANIES, updated);
    return newCompany;
  }

  static async updateCompany(id: string, data: Partial<Company>): Promise<Company> {
    await this.delay(400);
    const companies = getItem<Company[]>(KEYS.COMPANIES, INITIAL_COMPANIES);
    const index = companies.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Company not found');

    const updatedCompany = { ...companies[index], ...data };
    companies[index] = updatedCompany;
    setItem(KEYS.COMPANIES, companies);
    return updatedCompany;
  }

  static async deleteCompany(id: string): Promise<boolean> {
    await this.delay(400);
    const companies = getItem<Company[]>(KEYS.COMPANIES, INITIAL_COMPANIES);
    const filtered = companies.filter((c) => c.id !== id);
    setItem(KEYS.COMPANIES, filtered);
    return true;
  }
}
