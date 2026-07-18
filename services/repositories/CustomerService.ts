import { Customer } from '@/types';
import { getItem, setItem, KEYS } from '@/lib/storage';

export class CustomerService {
  private static async delay(ms = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async getAllCustomers(salesId?: string): Promise<Customer[]> {
    await this.delay();
    const customers = getItem<Customer[]>(KEYS.CUSTOMERS, []);
    return salesId ? customers.filter((c) => c.assignedSalesId === salesId) : customers;
  }

  static async getCustomerById(id: string): Promise<Customer | null> {
    await this.delay();
    const customers = getItem<Customer[]>(KEYS.CUSTOMERS, []);
    return customers.find((c) => c.id === id) || null;
  }

  static async createCustomer(data: Omit<Customer, 'id' | 'createdAt' | 'totalSpent'>): Promise<Customer> {
    await this.delay(400);
    const customers = getItem<Customer[]>(KEYS.CUSTOMERS, []);
    const newCustomer: Customer = {
      ...data,
      id: `cust-${Date.now()}`,
      totalSpent: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setItem(KEYS.CUSTOMERS, [newCustomer, ...customers]);
    return newCustomer;
  }

  static async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    await this.delay(300);
    const customers = getItem<Customer[]>(KEYS.CUSTOMERS, []);
    const index = customers.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Customer not found');

    const updated = { ...customers[index], ...data };
    customers[index] = updated;
    setItem(KEYS.CUSTOMERS, customers);
    return updated;
  }
}
