export type UserRole = 'super_admin' | 'company_admin' | 'sales';

export interface BaseEntity {
  id: string;
  companyId: string;
  createdAt: string;
  updatedAt?: string;
  externalId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  companyId?: string;
  companyName?: string;
  phone?: string;
  department?: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  createdAt: string;
  status: 'active' | 'inactive';
  salesCount?: number;
  totalRevenue?: number;
}

export interface CompanyAdmin extends BaseEntity {
  companyName?: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
}

export interface SalesRep extends BaseEntity {
  companyName?: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  department: string;
  joinDate: string;
  revenue: number;
  kpiTarget: number;
  kpiAchieved: number;
  commission: number;
  activeLeadsCount: number;
}

export interface Customer extends BaseEntity {
  name: string;
  avatar: string;
  phone: string;
  email: string;
  birthday: string;
  city: string;
  totalSpent: number;
  favoriteProduct: string;
  assignedSalesId: string;
  assignedSalesName: string;
  tier: 'Standard' | 'Silver' | 'Gold' | 'VIP';
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'sales' | 'ai';
  senderName: string;
  message: string;
  timestamp: string;
}

export type SentimentType = 'Positive' | 'Neutral' | 'Negative';
export type IntentType = 'High Purchase Intent' | 'Price Inquiry' | 'Custom Order' | 'After-Sales Support' | 'Price Hesitation';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface Conversation extends BaseEntity {
  customerId: string;
  customerName: string;
  customerAvatar: string;
  customerPhone: string;
  assignedSalesId: string;
  assignedSalesName: string;
  score: number;
  sentiment: SentimentType;
  intent: IntentType;
  riskLevel: RiskLevel;
  chatHistory: ChatMessage[];
  aiSummary: string;
  nextAction: string;
  status: 'Open' | 'Pending Sales' | 'Closed / Won' | 'Lost';
  updatedAt: string;
  lastMessage: string;
  channel?: 'facebook' | 'zalo' | 'website' | 'call';
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipping' | 'Completed' | 'Cancelled' | 'Refunded';

export interface Order extends BaseEntity {
  customerId: string;
  customerName: string;
  salesId: string;
  salesName: string;
  product: string;
  amount: number;
  commission: number;
  status: OrderStatus;
}

export interface KPIMetric extends BaseEntity {
  periodType: 'monthly' | 'quarterly' | 'yearly';
  periodName: string;
  revenueTarget: number;
  revenueAchieved: number;
  ordersTarget: number;
  ordersAchieved: number;
  customersTarget: number;
  customersAchieved: number;
  conversionTarget: number;
  conversionAchieved: number;
  repeatCustomersTarget: number;
  repeatCustomersAchieved: number;
}

export interface CommissionRule extends BaseEntity {
  minKpiPercent: number;
  maxKpiPercent: number | null;
  commissionRate: number;
  label: string;
}

export interface AISettings {
  openaiApiKey: string;
  geminiApiKey: string;
  claudeApiKey: string;
  selectedModel: 'GPT-5' | 'GPT-4.1' | 'Claude Sonnet' | 'Claude Opus' | 'Gemini 2.5 Pro' | 'Gemini Flash' | 'DeepSeek' | 'Llama 4';
  autoSummaryTime: string;
  leadScoringEnabled: boolean;
}

export interface ApiKey extends BaseEntity {
  name: string;
  key: string; // e.g. sak_live_jemmia_xxxxxxxxxxxxxxxxx
  status: 'Active' | 'Disabled' | 'Expired';
  createdBy: string;
  lastUsedAt: string | null;
  ipWhitelist?: string;
  rateLimit?: number; // requests per minute
}

export interface WebhookEndpoint extends BaseEntity {
  url: string;
  events: string[]; // e.g. ['customer.created', 'order.created']
  secret: string;
  status: 'Active' | 'Disabled';
  description?: string;
}

export interface ApiLogItem extends BaseEntity {
  apiKeyId: string;
  apiKeyName: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  statusCode: number;
  responseTimeMs: number;
  requestBody?: any;
  responseBody?: any;
  ipAddress?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'kpi' | 'customer' | 'order' | 'ai_summary' | 'system' | 'api';
  timestamp: string;
  read: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  subtitle: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  dueDate: string;
  customerId?: string;
  orderId?: string;
}

export interface CustomerTimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  salesOwner: string;
  type: 'lead' | 'chat' | 'call' | 'visit' | 'quotation' | 'order' | 'payment' | 'warranty' | 'support';
}
