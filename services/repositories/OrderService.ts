import { Order, OrderStatus } from '@/types';
import { getItem, setItem, KEYS } from '@/lib/storage';

export class OrderService {
  private static async delay(ms = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async getAllOrders(salesId?: string): Promise<Order[]> {
    await this.delay();
    const orders = getItem<Order[]>(KEYS.ORDERS, []);
    return salesId ? orders.filter((o) => o.salesId === salesId) : orders;
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    await this.delay(350);
    const orders = getItem<Order[]>(KEYS.ORDERS, []);
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) throw new Error('Order not found');

    orders[index].status = status;
    setItem(KEYS.ORDERS, orders);
    return orders[index];
  }

  static async createOrder(data: Omit<Order, 'id' | 'createdAt' | 'commission'>): Promise<Order> {
    await this.delay(450);
    const orders = getItem<Order[]>(KEYS.ORDERS, []);
    const commission = Math.floor(data.amount * 0.04);
    const newOrder: Order = {
      ...data,
      id: `ORD-${2100 + orders.length}`,
      commission,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setItem(KEYS.ORDERS, [newOrder, ...orders]);
    return newOrder;
  }
}
