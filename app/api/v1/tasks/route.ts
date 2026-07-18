import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Bearer token required.' }, { status: 401 });
    }

    const body = await req.json();
    const { title, subtitle, priority = 'High', dueDate = 'Today' } = body;

    const taskId = `task-${Date.now()}`;

    return NextResponse.json({
      success: true,
      taskId,
      title,
      subtitle,
      priority,
      dueDate,
      message: 'Sales task created and synced to dashboard',
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
