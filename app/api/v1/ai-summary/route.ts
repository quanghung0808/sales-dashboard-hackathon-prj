import { NextRequest, NextResponse } from 'next/server';
import { MockAIService } from '@/services/mock/mockAIService';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Bearer token required.' }, { status: 401 });
    }

    const body = await req.json();
    const { salesName = 'Nguyễn Văn An', kpiPercent = 78, revenue = 350000000 } = body;

    const summary = await MockAIService.generateDashboardSummary(salesName, kpiPercent, revenue);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      salesName,
      kpiPercent,
      revenue,
      summary,
      message: 'AI Daily Sales summary generated successfully',
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
