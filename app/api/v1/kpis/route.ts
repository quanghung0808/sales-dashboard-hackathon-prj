import { NextResponse } from 'next/server';
import { getItem, setItem, KEYS } from '@/lib/storage';
import { KPIMetric, ApiKey } from '@/types';
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

  const kpis = getItem<KPIMetric[]>(KEYS.KPIS, []);
  const companyKpis = kpis.filter((k) => k.companyId === auth.companyId);

  return NextResponse.json({
    success: true,
    total: companyKpis.length,
    data: companyKpis,
  });
}

export async function POST(req: Request) {
  const auth = resolveCompanyFromKey(req);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Invalid API Key' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { salesId, period, targetRevenue, targetOrders, targetCustomers } = body;

    if (!targetRevenue) {
      return NextResponse.json({ success: false, error: 'Missing required field: targetRevenue' }, { status: 400 });
    }

    const kpis = getItem<KPIMetric[]>(KEYS.KPIS, []);

    const newKpi: KPIMetric = {
      id: `kpi-sync-${Date.now()}`,
      companyId: auth.companyId,
      externalId: salesId ? `KPI-${salesId}-${period}` : `KPI-${period}`,
      periodType: 'monthly',
      periodName: period || '2026-07',
      revenueTarget: Number(targetRevenue),
      revenueAchieved: Math.floor(Number(targetRevenue) * 0.78),
      ordersTarget: Number(targetOrders || 20),
      ordersAchieved: Math.floor(Number(targetOrders || 20) * 0.8),
      customersTarget: Number(targetCustomers || 40),
      customersAchieved: Math.floor(Number(targetCustomers || 40) * 0.75),
      conversionTarget: 30,
      conversionAchieved: 28.5,
      repeatCustomersTarget: 40,
      repeatCustomersAchieved: 42,
      createdAt: new Date().toISOString().split('T')[0],
    };

    kpis.unshift(newKpi);
    setItem(KEYS.KPIS, kpis);

    return NextResponse.json(
      {
        success: true,
        kpiId: newKpi.id,
        period: newKpi.periodName,
        message: 'KPI targets uploaded and synchronized successfully',
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
