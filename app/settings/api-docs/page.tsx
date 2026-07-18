'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiKeyService } from '@/services/repositories/ApiKeyService';
import { ApiLogService } from '@/services/repositories/ApiLogService';
import { BookOpen, ShieldCheck, Play, Send, Copy, CheckCircle2, Code2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type LanguageType = 'curl' | 'javascript' | 'python' | 'typescript';

interface DocSection {
  id: string;
  name: string;
  category: string;
  method?: 'POST' | 'PUT' | 'GET';
  path?: string;
  desc?: string;
  sampleBody?: any;
  sampleResponse?: any;
}

const SECTIONS: DocSection[] = [
  {
    id: 'auth',
    name: '1. Authentication Header',
    category: 'Xác Thực',
    desc: 'Mọi request cần đính kèm Bearer API Key vào HTTP Header.',
  },
  {
    id: 'customers-sync',
    name: '2. Đồng bộ Khách Hàng Mới',
    category: 'Khách Hàng',
    method: 'POST',
    path: '/api/v1/customers',
    desc: 'Đồng bộ hoặc tạo mới hồ sơ khách hàng từ CRM/ERP bên ngoài.',
    sampleBody: {
      externalId: 'CUS001',
      name: 'Nguyễn Văn A',
      phone: '0909123456',
      email: 'a@gmail.com',
      assignedSales: 'EMP001',
      city: 'TP. Hồ Chí Minh',
      favoriteProduct: 'Diamond Ring 1ct GIA',
    },
    sampleResponse: {
      success: true,
      customerId: 'cus_cus001_172129000',
      externalId: 'CUS001',
      message: 'Customer synchronized successfully',
    },
  },
  {
    id: 'customers-360',
    name: '3. Khách Hàng 360° & Hạng VIP (Customer 360 API)',
    category: 'Khách Hàng',
    method: 'GET',
    path: '/api/v1/customers/CUS001',
    desc: 'Truy vấn chi tiết hồ sơ 360°, tổng chi tiêu, hạng thành viên (VIP, Gold, Silver) và lịch sử trải nghiệm (Timeline Events).',
    sampleBody: {},
    sampleResponse: {
      success: true,
      customer: {
        id: 'cust-1',
        externalId: 'CUS001',
        name: 'Phạm Minh Tuấn',
        phone: '0909123456',
        tier: 'VIP',
        totalSpent: 385000000,
        favoriteProduct: 'Nhẫn kim cương 1.2ct GIA',
        timelineEvents: [
          { date: '2026-07-01 09:30', title: 'Lead Created', type: 'lead' },
          { date: '2026-07-02 14:00', title: 'Store Visit', type: 'visit' },
          { date: '2026-07-04 11:00', title: 'Order Created 185tr', type: 'order' }
        ]
      }
    },
  },
  {
    id: 'customers-update-tier',
    name: '4. Cập Nhật Hạng & Thông Tin Khách Hàng',
    category: 'Khách Hàng',
    method: 'PUT',
    path: '/api/v1/customers/CUS001',
    desc: 'Cập nhật hạng thành viên (VIP, Gold, Silver, Standard), số điện thoại, thành phố hoặc ghi chú tư vấn.',
    sampleBody: {
      tier: 'VIP',
      totalSpent: 450000000,
      city: 'Hà Nội',
    },
    sampleResponse: {
      success: true,
      customerId: 'cust-1',
      externalId: 'CUS001',
      tier: 'VIP',
      message: 'Customer 360 profile updated successfully',
    },
  },
  {
    id: 'orders',
    name: '5. Đồng bộ Đơn Hàng (Order API)',
    category: 'Đơn Hàng',
    method: 'POST',
    path: '/api/v1/orders',
    desc: 'Đồng bộ đơn hàng phát sinh từ Website eCommerce, POS Showroom hoặc App.',
    sampleBody: {
      externalId: 'ORDER001',
      customerId: 'CUS001',
      salesId: 'EMP001',
      product: 'Nhẫn Cưới Vĩnh Cửu 18k GIA',
      amount: 52000000,
      status: 'Completed',
    },
    sampleResponse: {
      success: true,
      orderId: 'ORD-ORDER001',
      externalId: 'ORDER001',
      message: 'Order synchronized successfully',
    },
  },
  {
    id: 'conversations',
    name: '6. Hội Thoại & Chấm Điểm AI (Conversations API)',
    category: 'Tư Vấn AI',
    method: 'POST',
    path: '/api/v1/conversations',
    desc: 'Đồng bộ tin nhắn tư vấn Facebook/Zalo. AI sẽ tự động phân tích cảm xúc và chấm điểm chốt đơn.',
    sampleBody: {
      externalId: 'CONV001',
      customerId: 'CUS001',
      salesId: 'EMP001',
      channel: 'facebook',
      messages: [
        { sender: 'customer', content: 'Cho mình hỏi mẫu nhẫn kim cương 1ct này giá bao nhiêu?' },
        { sender: 'sales', content: 'Dạ em chào anh/chị, mẫu này bên em đang ưu đãi 185 triệu ạ.' },
      ],
    },
    sampleResponse: {
      success: true,
      conversationId: 'CONV-CONV001',
      externalId: 'CONV001',
      aiScore: 92,
      message: 'Conversation synchronized & AI analyzed successfully',
    },
  },
  {
    id: 'ai-summary',
    name: '7. Báo Cáo 18:00 AI Summary (AI Summary API)',
    category: 'Tư Vấn AI',
    method: 'POST',
    path: '/api/v1/ai-summary',
    desc: 'Tự động tổng hợp báo cáo hiệu suất bán hàng cuối ngày và gợi ý kế hoạch tư vấn ngày mai.',
    sampleBody: {
      salesName: 'Nguyễn Văn An',
      kpiPercent: 78,
      revenue: 350000000,
    },
    sampleResponse: {
      success: true,
      timestamp: '2026-07-18T18:00:00Z',
      salesName: 'Nguyễn Văn An',
      summary: 'Hôm nay bạn đã đạt 78% KPI với 350.000.000đ doanh thu. Ngày mai cần ưu tiên gọi lại khách hàng Lan Anh!',
    },
  },
  {
    id: 'tasks',
    name: '8. Nhiệm Vụ AI Gợi Ý (AI Tasks API)',
    category: 'Quản Lý Sales',
    method: 'POST',
    path: '/api/v1/tasks',
    desc: 'Tạo hoặc đồng bộ danh sách nhiệm vụ cần làm hôm nay kèm mức ưu tiên High/Medium/Low.',
    sampleBody: {
      title: '🔥 Call Nguyễn Văn Hải',
      subtitle: 'Hỏi cảm nhận viên kim cương 1.2ct sau 3 ngày mua',
      priority: 'High',
      dueDate: 'Today, 2:00 PM',
    },
    sampleResponse: {
      success: true,
      taskId: 'task-172129000',
      title: '🔥 Call Nguyễn Văn Hải',
      priority: 'High',
      message: 'Sales task created and synced to dashboard',
    },
  },
  {
    id: 'sales',
    name: '9. Hồ Sơ Nhân Viên Sales (Sales Rep API)',
    category: 'Quản Lý Sales',
    method: 'POST',
    path: '/api/v1/sales',
    desc: 'Đồng bộ hồ sơ nhân viên tư vấn bán hàng từ phần mềm nhân sự HRM.',
    sampleBody: {
      externalId: 'EMP001',
      name: 'Nguyễn Văn An',
      email: 'an@company.com',
      phone: '0909888888',
      department: 'VIP Consultation',
    },
    sampleResponse: {
      success: true,
      salesId: 'sales_emp001',
      externalId: 'EMP001',
      message: 'Sales record synchronized successfully',
    },
  },
  {
    id: 'kpis',
    name: '10. Chỉ Tiêu Doanh Số KPI (KPI Targets API)',
    category: 'Chỉ Tiêu Sales',
    method: 'POST',
    path: '/api/v1/kpis',
    desc: 'Tải lên chỉ tiêu doanh số tháng/quý/năm cho nhân viên sales.',
    sampleBody: {
      salesId: 'EMP001',
      period: '2026-07',
      targetRevenue: 1000000000,
      targetOrders: 20,
      targetCustomers: 40,
    },
    sampleResponse: {
      success: true,
      kpiId: 'kpi-sync-172129000',
      period: '2026-07',
      message: 'KPI targets uploaded and synchronized successfully',
    },
  },
  {
    id: 'webhooks',
    name: '11. Sự Kiện Webhooks (Webhooks Events)',
    category: 'Webhooks',
    desc: 'Đăng ký URL để nhận sự kiện thời gian thực: customer.created, order.created, conversation.created, ai.summary.completed.',
  },
];

export default function DashboardApiDocsPage() {
  const [activeId, setActiveId] = useState<string>('customers-360');
  const [activeLang, setActiveLang] = useState<LanguageType>('curl');
  const [copiedCode, setCopiedCode] = useState(false);

  // Playground state
  const [playgroundBody, setPlaygroundBody] = useState<string>('');
  const [playgroundResponse, setPlaygroundResponse] = useState<any>(null);
  const [playgroundLoading, setPlaygroundLoading] = useState(false);
  const [playgroundStatus, setPlaygroundStatus] = useState<number | null>(null);

  const { data: keys = [] } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: () => ApiKeyService.getApiKeys('comp-1'),
  });

  const activeApiKey = keys.find((k) => k.status === 'Active')?.key || 'sak_live_jemmia_8f92a10b4c7e901a2b3c';
  const activeSec = SECTIONS.find((s) => s.id === activeId) || SECTIONS[2];

  React.useEffect(() => {
    if (activeSec.sampleBody) {
      setPlaygroundBody(JSON.stringify(activeSec.sampleBody, null, 2));
      setPlaygroundResponse(null);
      setPlaygroundStatus(null);
    }
  }, [activeId, activeSec]);

  const handleRunTest = async () => {
    if (!activeSec.path || !activeSec.method) return;
    setPlaygroundLoading(true);
    setPlaygroundResponse(null);
    const startTime = Date.now();

    try {
      const parsedBody = activeSec.method === 'GET' ? undefined : JSON.parse(playgroundBody);
      const res = await fetch(activeSec.path, {
        method: activeSec.method,
        headers: {
          Authorization: `Bearer ${activeApiKey}`,
          'Content-Type': 'application/json',
        },
        body: parsedBody ? JSON.stringify(parsedBody) : undefined,
      });

      const latency = Date.now() - startTime;
      const data = await res.json();
      setPlaygroundStatus(res.status);
      setPlaygroundResponse(data);

      await ApiLogService.logRequest({
        companyId: 'comp-1',
        apiKeyId: 'key-1',
        apiKeyName: 'Dashboard Docs Key',
        endpoint: activeSec.path,
        method: activeSec.method,
        statusCode: res.status,
        responseTimeMs: latency,
        requestBody: parsedBody,
        responseBody: data,
        createdAt: new Date().toISOString().split('T')[0],
      });
    } catch (e: any) {
      setPlaygroundStatus(500);
      setPlaygroundResponse({ success: false, error: e.message || 'Format JSON không hợp lệ' });
    } finally {
      setPlaygroundLoading(false);
    }
  };

  const getSDKCode = () => {
    if (!activeSec.path || !activeSec.method) return '';
    const url = `https://api.jemmia-crm.vn${activeSec.path}`;
    const isGet = activeSec.method === 'GET';
    const bodyStr = JSON.stringify(activeSec.sampleBody, null, 2);

    if (activeLang === 'curl') {
      return isGet
        ? `curl -X GET "${url}" -H "Authorization: Bearer ${activeApiKey}"`
        : `curl -X ${activeSec.method} "${url}" \\
  -H "Authorization: Bearer ${activeApiKey}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(activeSec.sampleBody)}'`;
    }
    if (activeLang === 'javascript') {
      return isGet
        ? `const res = await fetch('${url}', {
  headers: { 'Authorization': 'Bearer ${activeApiKey}' }
});
const data = await res.json();
console.log(data);`
        : `const res = await fetch('${url}', {
  method: '${activeSec.method}',
  headers: {
    'Authorization': 'Bearer ${activeApiKey}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(${bodyStr})
});
const data = await res.json();
console.log(data);`;
    }
    if (activeLang === 'python') {
      return isGet
        ? `import requests
res = requests.get("${url}", headers={"Authorization": "Bearer ${activeApiKey}"})
print(res.json())`
        : `import requests
res = requests.${activeSec.method.toLowerCase()}("${url}", json=${bodyStr.replace(/true/g, 'True').replace(/false/g, 'False')}, headers={"Authorization": "Bearer ${activeApiKey}"})
print(res.json())`;
    }
    return `import axios from 'axios';
const { data } = await axios.${activeSec.method.toLowerCase()}('${url}', ${isGet ? '' : bodyStr + ', '}{
  headers: { 'Authorization': 'Bearer ${activeApiKey}' }
});
console.log(data);`;
  };

  const codeSnippet = getSDKCode();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-500" /> Tài Liệu REST API - Khách Hàng 360° & Hạng VIP
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Bao gồm đầy đủ API cho Khách Hàng 360°, Hạng Thành Viên VIP/Gold/Silver, Timeline Events & Đơn Hàng
        </p>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Sidebar */}
        <div className="md:col-span-1 space-y-1 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 sticky top-20">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-2">
            Danh Mục API (11 Mục)
          </div>
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveId(sec.id)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors text-left ${
                activeId === sec.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <span className="truncate pr-1">{sec.name}</span>
              {sec.method && (
                <Badge variant={sec.method === 'POST' ? 'default' : sec.method === 'PUT' ? 'warning' : 'secondary'} className="text-[9px] px-1 py-0 shrink-0">
                  {sec.method}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* Right Content */}
        <div className="md:col-span-3 space-y-6">
          {activeSec.id === 'auth' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <ShieldCheck className="h-5 w-5 text-emerald-500" /> Xác Thực Request (Authorization Header)
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tất cả HTTP request gửi tới REST API đều phải đính kèm Header Authorization chứa Bearer Token do Admin cấp:
              </p>
              <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-emerald-400 overflow-x-auto border border-slate-800">
                Authorization: Bearer {activeApiKey}
              </pre>
            </div>
          )}

          {activeSec.id === 'webhooks' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Sự Kiện Webhooks (Webhooks Events)</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Đăng ký URL Webhook để nhận thông báo sự kiện thời gian thực khi có khách hàng mới, thay đổi hạng VIP hoặc báo cáo AI summary.
              </p>
              <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-indigo-300 border border-slate-800 space-y-2">
                <div>• customer.created - Phát sinh khi có khách mới</div>
                <div>• customer.updated - Cập nhật hạng VIP hoặc thông tin khách</div>
                <div>• order.created - Phát sinh khi có đơn hàng mới</div>
                <div>• ai.summary.completed - Báo cáo AI 18:00 hoàn tất</div>
              </div>
            </div>
          )}

          {activeSec.path && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Badge variant={activeSec.method === 'POST' ? 'default' : activeSec.method === 'PUT' ? 'warning' : 'secondary'} className="text-xs px-2 py-0.5 font-bold">
                    {activeSec.method}
                  </Badge>
                  <code className="text-base font-mono font-bold text-slate-900 dark:text-white">{activeSec.path}</code>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{activeSec.name}</h2>
                <p className="text-xs text-slate-500">{activeSec.desc}</p>
              </div>

              {/* Code Snippets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                    <Code2 className="h-4 w-4 text-blue-500" /> Mẫu Code SDK ({activeLang.toUpperCase()})
                  </span>
                  <div className="flex gap-1">
                    {(['curl', 'javascript', 'python', 'typescript'] as LanguageType[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setActiveLang(lang)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold uppercase ${
                          activeLang === lang ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-100 overflow-x-auto border border-slate-800">
                    {codeSnippet}
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(codeSnippet);
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }}
                    className="absolute top-3 right-3 rounded-lg bg-slate-800 p-1.5 text-xs text-slate-300 hover:bg-slate-700 flex items-center gap-1"
                  >
                    {copiedCode ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedCode ? 'Đã chép' : 'Sao chép'}
                  </button>
                </div>
              </div>

              {/* Interactive Playground */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Play className="h-4 w-4 text-emerald-500" /> Thử Nghiệm API Trực Tiếp
                  </span>
                  <span className="text-[11px] text-slate-400">Tự động đồng bộ dữ liệu vào CRM</span>
                </div>

                {activeSec.method !== 'GET' && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-400">JSON Request Body Payload</label>
                    <textarea
                      value={playgroundBody}
                      onChange={(e) => setPlaygroundBody(e.target.value)}
                      rows={7}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 font-mono text-xs text-emerald-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    variant="gradient"
                    onClick={handleRunTest}
                    disabled={playgroundLoading}
                    className="flex items-center gap-2 h-10 px-6 font-bold"
                  >
                    <Send className="h-4 w-4" />
                    {playgroundLoading ? 'Đang gửi Request...' : 'Gửi HTTP Request Thử Ngay'}
                  </Button>
                </div>

                {playgroundResponse && (
                  <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Kết Quả Phản Hồi (Response)</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${playgroundStatus === 200 || playgroundStatus === 201 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        HTTP {playgroundStatus} {playgroundStatus === 200 ? 'OK' : playgroundStatus === 201 ? 'Created' : 'Error'}
                      </span>
                    </div>
                    <pre className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-emerald-300 overflow-x-auto border border-slate-800 max-h-56">
                      {JSON.stringify(playgroundResponse, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
