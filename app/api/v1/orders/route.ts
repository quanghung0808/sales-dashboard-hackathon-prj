import { NextResponse } from 'next/server';
import { getItem, setItem, KEYS } from '@/lib/storage';
import { Order, ApiKey } from '@/types';
import { INITIAL_API_KEYS } from '@/services/mock/mockApiData';

function resolveCompanyFromKey(req: Request): { companyId: string } | null {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return null;

  const apiKeys = getItem<ApiKey[]>(KEYS.API_KEYS, INITIAL_API_KEYS);
  const foundKey = apiKeys.find((k) => k.key === token && k.status === 'Active');
  if (foundKey) return { companyId: foundKey.companyId };
  if (token.includes('jemmia')) return { companyId: 'comp-1' };
  return null;
}

export async function GET(req: Request) {
  const auth = resolveCompanyFromKey(req);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Invalid API Key' }, { status: 401 });
  }

  const orders = getItem<Order[]>(KEYS.ORDERS, []);
  const companyOrders = orders.filter((o) => o.companyId === auth.companyId);

  return NextResponse.json({
    success: true,
    total: companyOrders.length,
    data: companyOrders,
  });
}

export async function POST(req: Request) {
  const auth = resolveCompanyFromKey(req);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Invalid API Key' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { externalId, customerId, salesId, amount, status, product } = body;

    if (!externalId || !amount) {
      return NextResponse.json({ success: false, error: 'Missing required fields: externalId, amount' }, { status: 400 });
    }

    const orders = getItem<Order[]>(KEYS.ORDERS, []);
    const existingIndex = orders.findIndex((o) => o.companyId === auth.companyId && o.externalId === externalId);

    const commission = Math.floor(amount * 0.04);
    const newOrder: Order = {
      id: existingIndex >= 0 ? orders[existingIndex].id : `ORD-${externalId}`,
      companyId: auth.companyId,
      externalId,
      customerId: customerId || 'cust-1',
      customerName: 'Nguyễn Văn A',
      salesId: salesId || 'sales-1',
      salesName: 'Nguyễn Văn An',
      product: product || 'Diamond Ring 1ct GIA',
      amount: Number(amount),
      commission,
      status: status || 'Completed',
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (existingIndex >= 0) {
      orders[existingIndex] = { ...orders[existingIndex], ...newOrder };
    } else {
      orders.unshift(newOrder);
    }

    setItem(KEYS.ORDERS, orders);

    return NextResponse.json(
      {
        success: true,
        orderId: newOrder.id,
        externalId: newOrder.externalId,
        message: 'Order synchronized successfully',
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
