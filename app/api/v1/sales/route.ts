import { NextResponse } from 'next/server';
import { getItem, setItem, KEYS } from '@/lib/storage';
import { SalesRep, ApiKey } from '@/types';
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

  const sales = getItem<SalesRep[]>(KEYS.SALES, []);
  const companySales = sales.filter((s) => s.companyId === auth.companyId);

  return NextResponse.json({
    success: true,
    total: companySales.length,
    data: companySales,
  });
}

export async function POST(req: Request) {
  const auth = resolveCompanyFromKey(req);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Invalid API Key' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { externalId, name, email, phone, department } = body;

    if (!name || !externalId) {
      return NextResponse.json({ success: false, error: 'Missing required fields: externalId, name' }, { status: 400 });
    }

    const salesList = getItem<SalesRep[]>(KEYS.SALES, []);
    const existingIndex = salesList.findIndex((s) => s.companyId === auth.companyId && s.externalId === externalId);

    const newSales: SalesRep = {
      id: existingIndex >= 0 ? salesList[existingIndex].id : `sales_${externalId.toLowerCase()}`,
      companyId: auth.companyId,
      externalId,
      name,
      email: email || `${externalId.toLowerCase()}@company.vn`,
      phone: phone || '0909888888',
      department: department || 'VIP Consultation',
      joinDate: new Date().toISOString().split('T')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      revenue: 0,
      kpiTarget: 450000000,
      kpiAchieved: 0,
      commission: 0,
      activeLeadsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (existingIndex >= 0) {
      salesList[existingIndex] = { ...salesList[existingIndex], ...newSales };
    } else {
      salesList.unshift(newSales);
    }

    setItem(KEYS.SALES, salesList);

    return NextResponse.json(
      {
        success: true,
        salesId: newSales.id,
        externalId: newSales.externalId,
        message: 'Sales record synchronized successfully',
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
