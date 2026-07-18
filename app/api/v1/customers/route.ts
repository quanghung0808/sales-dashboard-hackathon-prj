import { NextResponse } from 'next/server';
import { getItem, setItem, KEYS } from '@/lib/storage';
import { Customer, ApiKey } from '@/types';
import { INITIAL_API_KEYS } from '@/services/mock/mockApiData';

function resolveCompanyFromKey(req: Request): { companyId: string; keyName: string; apiKeyId: string } | null {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (!token) return null;

  const apiKeys = getItem<ApiKey[]>(KEYS.API_KEYS, INITIAL_API_KEYS);
  const foundKey = apiKeys.find((k) => k.key === token && k.status === 'Active');

  if (foundKey) {
    return { companyId: foundKey.companyId, keyName: foundKey.name, apiKeyId: foundKey.id };
  }

  // Fallback for demo testing keys
  if (token.includes('jemmia')) {
    return { companyId: 'comp-1', keyName: 'Jemmia API Key', apiKeyId: 'key-1' };
  }
  if (token.includes('diamondworld') || token.includes('pnj')) {
    return { companyId: 'comp-2', keyName: 'Diamond World Key', apiKeyId: 'key-3' };
  }
  return null;
}

export async function GET(req: Request) {
  const auth = resolveCompanyFromKey(req);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Invalid API Key' }, { status: 401 });
  }

  const customers = getItem<Customer[]>(KEYS.CUSTOMERS, []);
  const companyCustomers = customers.filter((c) => c.companyId === auth.companyId);

  return NextResponse.json({
    success: true,
    total: companyCustomers.length,
    data: companyCustomers,
  });
}

export async function POST(req: Request) {
  const auth = resolveCompanyFromKey(req);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Invalid API Key' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { externalId, name, phone, email, assignedSales, city, favoriteProduct } = body;

    if (!name || !externalId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: externalId, name' },
        { status: 400 }
      );
    }

    const customers = getItem<Customer[]>(KEYS.CUSTOMERS, []);
    
    // Check if customer with externalId already exists for this tenant
    const existingIndex = customers.findIndex((c) => c.companyId === auth.companyId && c.externalId === externalId);

    const newCustomerId = `cus_${externalId.toLowerCase()}_${Date.now()}`;
    const newCustomer: Customer = {
      id: existingIndex >= 0 ? customers[existingIndex].id : newCustomerId,
      companyId: auth.companyId,
      externalId,
      name,
      phone: phone || '0909000111',
      email: email || `cust.${externalId}@gmail.com`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      birthday: '1990-05-15',
      city: city || 'TP. Hồ Chí Minh',
      totalSpent: 0,
      favoriteProduct: favoriteProduct || 'Diamond Ring',
      assignedSalesId: assignedSales || 'sales-1',
      assignedSalesName: 'Nguyễn Văn An',
      tier: 'Standard',
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (existingIndex >= 0) {
      customers[existingIndex] = { ...customers[existingIndex], ...newCustomer };
    } else {
      customers.unshift(newCustomer);
    }

    setItem(KEYS.CUSTOMERS, customers);

    return NextResponse.json(
      {
        success: true,
        customerId: newCustomer.id,
        externalId: newCustomer.externalId,
        message: existingIndex >= 0 ? 'Customer updated successfully' : 'Customer created successfully',
      },
      { status: existingIndex >= 0 ? 200 : 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
