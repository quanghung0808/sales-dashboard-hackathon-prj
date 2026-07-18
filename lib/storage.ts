import {
  INITIAL_COMPANIES,
  INITIAL_ADMINS,
  generateMockSales,
  generateMockCustomers,
  generateMockOrders,
  generateMockConversations,
  INITIAL_KPI_METRICS,
  INITIAL_COMMISSION_RULES,
  INITIAL_AI_SETTINGS,
  INITIAL_TASKS,
  INITIAL_NOTIFICATIONS
} from '@/services/mock/mockData';
import { INITIAL_API_KEYS, INITIAL_WEBHOOKS, INITIAL_API_LOGS } from '@/services/mock/mockApiData';

const KEYS = {
  COMPANIES: 'crm_mock_companies',
  ADMINS: 'crm_mock_admins',
  SALES: 'crm_mock_sales',
  CUSTOMERS: 'crm_mock_customers',
  ORDERS: 'crm_mock_orders',
  CONVERSATIONS: 'crm_mock_conversations',
  KPIS: 'crm_mock_kpis',
  COMMISSION_RULES: 'crm_mock_commission_rules',
  AI_SETTINGS: 'crm_mock_ai_settings',
  TASKS: 'crm_mock_tasks',
  NOTIFICATIONS: 'crm_mock_notifications',
  CURRENT_USER: 'crm_mock_current_user',
  THEME: 'crm_theme',

  // Multi-Tenant API Keys & Integration Storage
  API_KEYS: 'crm_mock_api_keys',
  WEBHOOKS: 'crm_mock_webhooks',
  API_LOGS: 'crm_mock_api_logs',
};

export function initLocalStorageMockData() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(KEYS.COMPANIES)) {
    localStorage.setItem(KEYS.COMPANIES, JSON.stringify(INITIAL_COMPANIES));
  }
  if (!localStorage.getItem(KEYS.ADMINS)) {
    localStorage.setItem(KEYS.ADMINS, JSON.stringify(INITIAL_ADMINS));
  }
  if (!localStorage.getItem(KEYS.SALES)) {
    const sales = generateMockSales();
    localStorage.setItem(KEYS.SALES, JSON.stringify(sales));
  }
  if (!localStorage.getItem(KEYS.CUSTOMERS)) {
    const salesStr = localStorage.getItem(KEYS.SALES);
    const sales = salesStr ? JSON.parse(salesStr) : generateMockSales();
    const customers = generateMockCustomers(sales);
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers));
  }

  // Force re-seed orders if existing storage doesn't have realistic daily range
  const ordersStr = localStorage.getItem(KEYS.ORDERS);
  if (!ordersStr || !ordersStr.includes('2026-07-18')) {
    const salesStr = localStorage.getItem(KEYS.SALES);
    const sales = salesStr ? JSON.parse(salesStr) : generateMockSales();
    const custStr = localStorage.getItem(KEYS.CUSTOMERS);
    const customers = custStr ? JSON.parse(custStr) : generateMockCustomers(sales);
    const orders = generateMockOrders(customers, sales);
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
  }

  if (!localStorage.getItem(KEYS.CONVERSATIONS)) {
    const salesStr = localStorage.getItem(KEYS.SALES);
    const sales = salesStr ? JSON.parse(salesStr) : generateMockSales();
    const custStr = localStorage.getItem(KEYS.CUSTOMERS);
    const customers = custStr ? JSON.parse(custStr) : generateMockCustomers(sales);
    const conversations = generateMockConversations(customers, sales);
    localStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }
  if (!localStorage.getItem(KEYS.KPIS)) {
    localStorage.setItem(KEYS.KPIS, JSON.stringify(INITIAL_KPI_METRICS));
  }
  if (!localStorage.getItem(KEYS.COMMISSION_RULES)) {
    localStorage.setItem(KEYS.COMMISSION_RULES, JSON.stringify(INITIAL_COMMISSION_RULES));
  }
  if (!localStorage.getItem(KEYS.AI_SETTINGS)) {
    localStorage.setItem(KEYS.AI_SETTINGS, JSON.stringify(INITIAL_AI_SETTINGS));
  }
  if (!localStorage.getItem(KEYS.TASKS)) {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
  }
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }

  // API Integration Storage Seeding
  if (!localStorage.getItem(KEYS.API_KEYS)) {
    localStorage.setItem(KEYS.API_KEYS, JSON.stringify(INITIAL_API_KEYS));
  }
  if (!localStorage.getItem(KEYS.WEBHOOKS)) {
    localStorage.setItem(KEYS.WEBHOOKS, JSON.stringify(INITIAL_WEBHOOKS));
  }
  if (!localStorage.getItem(KEYS.API_LOGS)) {
    localStorage.setItem(KEYS.API_LOGS, JSON.stringify(INITIAL_API_LOGS));
  }
}

export function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    let item = localStorage.getItem(key);
    if ((!item || (key === KEYS.ORDERS && !item.includes('2026-07-18'))) && key.startsWith('crm_mock_')) {
      initLocalStorageMockData();
      item = localStorage.getItem(key);
    }
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error('LocalStorage read error:', e);
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

export { KEYS };
