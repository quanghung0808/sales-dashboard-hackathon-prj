import { NextResponse } from 'next/server';
import { getItem, setItem, KEYS } from '@/lib/storage';
import { Customer, ApiKey } from '@/types';
import { INITIAL_API_KEYS } from '@/services/mock/mockApiData';
import { MOCK_TIMELINE_EVENTS } from '@/services/mock/mockData';

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

export async function GET(req: Request, { params }: { params: Promise<{ externalId: string }> }) {
  const auth = resolveCompanyFromKey(req);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Invalid API Key' }, { status: 401 });
  }

  const { externalId } = await params;
  const customers = getItem<Customer[]>(KEYS.CUSTOMERS, []);
  const customer = customers.find((c) => c.externalId === externalId || c.id === externalId);

  if (!customer) {
    // Fallback demo customer 360
    return NextResponse.json({
      success: true,
      customer: {
        id: 'cust-1',
        externalId: externalId || 'CUS001',
        name: 'Phạm Minh Tuấn',
        phone: '0909123456',
        email: 'tuan.pham@gmail.com',
        city: 'TP. Hồ Chí Minh',
        totalSpent: 385000000,
        tier: 'VIP',
        favoriteProduct: 'Nhẫn kim cương 1.2ct GIA nước D',
        assignedSalesName: 'Nguyễn Văn An',
        timelineEvents: MOCK_TIMELINE_EVENTS,
      },
    });
  }

  return NextResponse.json({
    success: true,
    customer: {
      ...customer,
      timelineEvents: MOCK_TIMELINE_EVENTS,
    },
  });
}

export async function PUT(req: Request, { params }: { params: Promise<{ externalId: string }> }) {
  const auth = resolveCompanyFromKey(req);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Invalid API Key' }, { status: 401 });
  }

  const { externalId } = await params;
  try {
    const body = await req.json();
    const customers = getItem<Customer[]>(KEYS.CUSTOMERS, []);
    const index = customers.findIndex((c) => c.companyId === auth.companyId && (c.externalId === externalId || c.id === externalId));

    if (index === -1) {
      return NextResponse.json({ success: false, error: `Customer with externalId ${externalId} not found` }, { status: 404 });
    }

    customers[index] = { ...customers[index], ...body, updatedAt: new Date().toISOString() };
    setItem(KEYS.CUSTOMERS, customers);

    return NextResponse.json({
      success: true,
      customerId: customers[index].id,
      externalId,
      tier: customers[index].tier,
      message: 'Customer 360 profile updated successfully',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
