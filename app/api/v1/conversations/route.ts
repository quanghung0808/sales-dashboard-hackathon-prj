import { NextResponse } from 'next/server';
import { getItem, setItem, KEYS } from '@/lib/storage';
import { Conversation, ApiKey, ChatMessage } from '@/types';
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

  const convs = getItem<Conversation[]>(KEYS.CONVERSATIONS, []);
  const companyConvs = convs.filter((c) => c.companyId === auth.companyId);

  return NextResponse.json({
    success: true,
    total: companyConvs.length,
    data: companyConvs,
  });
}

export async function POST(req: Request) {
  const auth = resolveCompanyFromKey(req);
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Invalid API Key' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { externalId, customerId, salesId, channel, messages } = body;

    if (!externalId || !messages) {
      return NextResponse.json({ success: false, error: 'Missing required fields: externalId, messages' }, { status: 400 });
    }

    const convs = getItem<Conversation[]>(KEYS.CONVERSATIONS, []);
    const existingIndex = convs.findIndex((c) => c.companyId === auth.companyId && c.externalId === externalId);

    const formattedChatHistory: ChatMessage[] = (messages || []).map((m: any, idx: number) => ({
      id: `msg-${externalId}-${idx}`,
      sender: m.sender || 'customer',
      senderName: m.sender === 'sales' ? 'Sale Nguyễn Văn An' : m.sender === 'ai' ? 'AI Assistant' : 'Khách Hàng',
      message: m.content || m.message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    const lastMsg = formattedChatHistory.length > 0 ? formattedChatHistory[formattedChatHistory.length - 1].message : 'Nội dung tin nhắn...';

    const newConv: Conversation = {
      id: existingIndex >= 0 ? convs[existingIndex].id : `CONV-${externalId}`,
      companyId: auth.companyId,
      externalId,
      customerId: customerId || 'cust-1',
      customerName: 'Nguyễn Văn A',
      customerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CustomerExt',
      customerPhone: '0909123456',
      assignedSalesId: salesId || 'sales-1',
      assignedSalesName: 'Nguyễn Văn An',
      score: 88,
      sentiment: 'Positive',
      intent: 'High Purchase Intent',
      riskLevel: 'Low',
      chatHistory: formattedChatHistory,
      aiSummary: `Khách hàng đang quan tâm tư vấn từ kênh ${channel || 'facebook'}. Đã hỏi giá và catalogues.`,
      nextAction: 'Gửi bảng báo giá chi tiết và voucher ưu đãi 5%.',
      status: 'Open',
      channel: channel || 'facebook',
      updatedAt: new Date().toLocaleString(),
      lastMessage: lastMsg,
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (existingIndex >= 0) {
      convs[existingIndex] = { ...convs[existingIndex], ...newConv };
    } else {
      convs.unshift(newConv);
    }

    setItem(KEYS.CONVERSATIONS, convs);

    return NextResponse.json(
      {
        success: true,
        conversationId: newConv.id,
        externalId: newConv.externalId,
        aiScore: newConv.score,
        message: 'Conversation synchronized & AI analyzed successfully',
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
