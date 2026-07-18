'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Code2,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Bot,
  MessageSquare,
  Clock,
  Target,
  Users,
  Activity,
  Layers,
  Building2,
  ChevronDown,
  Send,
  Star,
  Flame,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function PublicLandingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Form State
  const [contactName, setContactName] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactName('');
      setContactCompany('');
      setContactEmail('');
      setContactMsg('');
    }, 4000);
  };

  const featureCards = [
    {
      icon: MessageSquare,
      title: 'Tổng Kết Hội Thoại AI',
      desc: 'Tự động tóm tắt tin nhắn tư vấn từ Facebook/Zalo, trích xuất ý định mua hàng và chấm điểm AI Score.',
    },
    {
      icon: Clock,
      title: 'Báo Cáo AI 18:00 Hàng Ngày',
      desc: 'Hệ thống tự động tổng hợp báo cáo hiệu suất bán hàng cuối ngày lúc 18:00 và đề xuất kế hoạch ngày mai.',
    },
    {
      icon: Users,
      title: 'Dòng Thời Gian Khách Hàng 360°',
      desc: 'Theo dõi toàn bộ hành trình trải nghiệm của khách từ Lead Created, Chat, Phone Call tới Order & Warranty.',
    },
    {
      icon: Target,
      title: 'Bảng Điều Khiển KPI',
      desc: 'Quản lý chỉ tiêu doanh thu, số đơn hàng, khách hàng mới theo Tháng, Quý & Năm với thanh tiến độ trực quan.',
    },
    {
      icon: Award,
      title: 'Hoa Hồng & Hiệu Suất Sales',
      desc: 'Thiết lập bảng hoa học bậc thang tự động theo mức đạt chỉ tiêu KPI (<80%, 80-100%, 100-120%, >120%).',
    },
    {
      icon: Sparkles,
      title: 'Gợi Ý Việc Cần Làm (AI Task)',
      desc: 'Trợ lý AI tự động đề xuất danh sách công việc cần xử lý hôm nay kèm phân loại mức độ ưu tiên High/Medium/Low.',
    },
    {
      icon: ShieldCheck,
      title: 'Đa Công Ty (Multi-Tenant) an toàn',
      desc: 'Kiến trúc bảo mật cô lập dữ liệu tuyệt đối theo từng Công ty (Jemmia, DOJI, PNJ, Diamond World...).',
    },
    {
      icon: Code2,
      title: 'Tích Hợp REST API',
      desc: 'Kết nối nhanh chóng hệ thống ERP/CRM/eCommerce bằng Bearer Token API Key và Webhook events.',
    },
    {
      icon: Activity,
      title: 'Phân Tích Bảng Điều Khiển Thời Gian Thực',
      desc: 'Màn hình theo dõi lưu lượng gọi API, thời gian phản hồi (latency) và tỷ lệ thành công của hệ thống.',
    },
  ];

  const solutions = [
    { name: 'Trang Sức Đá Quý (Jewelry)', desc: 'Jemmia, PNJ, DOJI, Diamond World...' },
    { name: 'Chuỗi Bán Lẻ (Retail)', desc: 'Thời trang, mỹ phẩm, đồ gia dụng cao cấp' },
    { name: 'Bảo Hiểm (Insurance)', desc: 'Bảo hiểm nhân thọ, tài sản & đầu tư' },
    { name: 'Ngân Hàng (Banking)', desc: 'Tín dụng VIP, dịch vụ tài chính cá nhân' },
    { name: 'Ô Tô (Automotive)', desc: 'Tư vấn xe hơi, lái thử & dịch vụ bảo dưỡng' },
    { name: 'Giáo Dục (Education)', desc: 'Tư vấn tuyển sinh & khóa học cao cấp' },
  ];

  const faqs = [
    {
      q: 'API hoạt động thế nào?',
      a: 'Hệ thống cung cấp chuẩn REST API với Authentication Header Bearer Token (`sak_live_...`). Bạn có thể gọi API từ bất kỳ hệ thống CRM/ERP/eCommerce nào để đồng bộ Khách Hàng, Đơn Hàng và Lịch Sử Hội Thoại.',
    },
    {
      q: 'Dữ liệu được cô lập giữa các công ty thế nào?',
      a: 'Mọi entity trong cơ sở dữ liệu đều bắt buộc ràng buộc với `companyId` duy nhất. Mỗi công ty chỉ có thể đọc và truy vấn dữ liệu thuộc về chính công ty đó.',
    },
    {
      q: 'Tôi có thể dùng API Key AI của riêng mình không?',
      a: 'Hoàn toàn được. Trong trang Cấu Hình AI (`/admin/ai-settings`), Company Admin có thể điền trực tiếp OpenAI API Key (`sk-...`), Gemini Key (`AIza...`) hoặc Claude Key để tự quản lý chi phí API.',
    },
    {
      q: 'Nền tảng có hỗ trợ nhiều công ty (Multi-Tenant) không?',
      a: 'Có. Nền tảng được thiết kế Multi-Tenant nguyên bản, hỗ trợ khởi tạo và phân quyền nhiều doanh nghiệp độc lập.',
    },
    {
      q: 'Tôi có thể tích hợp với CRM / ERP hiện tại không?',
      a: 'Rất dễ dàng! Chúng tôi cung cấp sẵn Public API Docs tại đường dẫn `/docs` kèm mẫu code cho 7 ngôn ngữ (cURL, JS, TS, Python, PHP, Java, C#) và Interactive Playground để thử nghiệm ngay lập tức.',
    },
  ];

  return (
    <div className="space-y-24 pb-20 animate-in fade-in duration-300">
      {/* Hero Section */}
      <section id="home" className="relative pt-12 md:pt-20 text-center space-y-8 max-w-5xl mx-auto px-4">
        {/* Glowing Ambient Backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 h-72 w-72 rounded-full bg-rose-600/15 blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-4 py-1.5 text-xs font-bold text-indigo-400">
          <Sparkles className="h-4 w-4 animate-spin text-indigo-400" /> Nền tảng SaaS cho Doanh Nghiệp
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-rose-500 bg-clip-text text-transparent leading-tight">
          Trợ Lý Bán Hàng AI cho Doanh Nghiệp Hiện Đại
        </h1>

        <p className="text-base md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
          Kết nối CRM, ERP hoặc nền tảng thương mại điện tử trong vài phút. Tự động tạo báo cáo AI, phân tích bán hàng, theo dõi KPI và dòng thời gian khách hàng mà không thay đổi quy trình làm việc hiện tại.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link href="/login">
            <Button variant="gradient" size="lg" className="h-12 px-8 text-base font-bold shadow-xl shadow-indigo-500/20">
              <span>Bắt Đầu</span>
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>

          <Link href="/docs">
            <Button variant="outline" size="lg" className="h-12 px-8 text-base font-semibold border-slate-300 dark:border-slate-700">
              <Code2 className="h-5 w-5 mr-2 text-indigo-500" /> Xem Tài Liệu API
            </Button>
          </Link>
        </div>

        {/* Hero Illustration Mockup */}
        <div className="pt-8 relative max-w-5xl mx-auto">
          <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-4 sm:p-6 shadow-2xl backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/90 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs">
                  CRM
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Jemmia Diamond AI Sales Workspace</h4>
                  <p className="text-[11px] text-slate-400">Live Multi-Tenant Sync • API Key sak_live_jemmia_8f92a1...</p>
                </div>
              </div>
              <Badge variant="success" className="text-xs">🔥 AI Score 92% (High Intent)</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
                <span className="font-bold text-indigo-400 block">🤖 AI Sales Greeting</span>
                <p className="text-slate-300">Chào Nguyễn Văn An! Bạn đã đạt 78% KPI tháng 7 với 350,000,000đ doanh số.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <span className="font-bold text-emerald-400 block">💰 Phản Hồi Đề Xuất</span>
                <p className="text-slate-300">&ldquo;Tặng voucher 5,000,000đ cho nhẫn kim cương GIA 1ct nước D hôm nay.&rdquo;</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <span className="font-bold text-amber-400 block">⚡ REST API Syncing</span>
                <p className="text-slate-300">POST /api/v1/orders HTTP 201 Created (42ms Latency)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="default" className="text-xs font-bold uppercase tracking-wider">Tính Năng</Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Tính Năng Nổi Bật Cho Doanh Nghiệp
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl mx-auto">
            Giải pháp CRM hỗ trợ AI tối ưu hóa hiệu suất bán hàng, quản lý khách hàng 360° và tích hợp API chuẩn hóa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureCards.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card key={idx} className="hover:border-indigo-500/50 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 mb-2">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{feat.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  <p>{feat.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="warning" className="text-xs font-bold uppercase tracking-wider">Giải Pháp Ngành</Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Giải Pháp Theo Ngành Trọng Điểm
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl mx-auto">
            Ứng dụng AI Sales Pilot tùy biến linh hoạt cho mọi lĩnh vực kinh doanh
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((sol, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl border border-slate-200/80 bg-white/80 dark:border-slate-800/80 dark:bg-slate-900/80 hover:border-blue-500/50 transition-all space-y-2"
            >
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-500" /> {sol.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{sol.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="danger" className="text-xs font-bold uppercase tracking-wider">Bảng Giá</Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Bảng Giá Linh Hoạt Cho Doanh Nghiệp
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl mx-auto">
            Lựa chọn gói dịch vụ phù hợp với quy mô đội ngũ sales và lưu lượng API
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter */}
          <Card className="relative overflow-hidden">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl">Gói Cơ Bản</CardTitle>
              <div className="text-3xl font-extrabold">9.900.000đ <span className="text-xs text-slate-400 font-normal">/tháng</span></div>
              <p className="text-xs text-slate-400">Cho doanh nghiệp vừa và nhỏ</p>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> 1 Công ty</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Tối đa 15 nhân viên</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> 50.000 lượt API/tháng</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Tổng kết hội thoại AI</li>
              </ul>
              <Link href="/login" className="block pt-2">
                <Button variant="outline" className="w-full">Bắt Đầu</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Professional */}
          <Card className="relative overflow-hidden border-2 border-indigo-500 shadow-xl">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase">
              Phổ Biến Nhất 🔥
            </div>
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl">Gói Chuyên Nghiệp</CardTitle>
              <div className="text-3xl font-extrabold text-indigo-400">19.900.000đ <span className="text-xs text-slate-400 font-normal">/tháng</span></div>
              <p className="text-xs text-slate-400">Cho chuỗi thương hiệu và showroom lớn</p>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Đa công ty (không giới hạn)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Tối đa 100 nhân viên</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> 500.000 lượt API/tháng</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Báo cáo AI 18:00 & Webhook</li>
              </ul>
              <Link href="/login" className="block pt-2">
                <Button variant="gradient" className="w-full font-bold">Bắt Đầu</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Enterprise */}
          <Card className="relative overflow-hidden">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl">Gói Doanh Nghiệp</CardTitle>
              <div className="text-3xl font-extrabold">Liên Hệ <span className="text-xs text-slate-400 font-normal">/báo giá</span></div>
              <p className="text-xs text-slate-400">Tùy biến riêng cho tập đoàn đa quốc gia</p>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Hạ tầng máy chủ riêng</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Không giới hạn nhân viên</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Tùy chỉnh mô hình AI & SLA</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Hỗ trợ kỹ thuật 24/7</li>
              </ul>
              <Link href="#contact" className="block pt-2">
                <Button variant="outline" className="w-full">Liên Hệ Tư Vấn</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3">
          <Badge variant="secondary" className="text-xs font-bold uppercase tracking-wider">Hỏi Đáp FAQ</Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Câu Hỏi Thường Gặp
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden dark:border-slate-800 dark:bg-slate-900 transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-4 text-left font-bold text-sm text-slate-900 dark:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-3xl mx-auto px-4">
        <Card>
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl">Liên Hệ Đăng Ký Tư Vấn Doanh Nghiệp</CardTitle>
            <p className="text-xs text-slate-400">Điền thông tin bên dưới để đội ngũ kỹ thuật hỗ trợ kết nối REST API cho công ty bạn</p>
          </CardHeader>
          <CardContent>
            {contactSubmitted && (
              <div className="p-4 mb-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" /> Đã nhận thông tin liên hệ! Đội ngũ tư vấn sẽ liên hệ lại trong 15 phút.
              </div>
            )}
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Họ Và Tên</label>
                  <Input value={contactName} onChange={(e) => setContactName(e.target.value)} required placeholder="Nguyễn Văn A" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Tên Công Ty</label>
                  <Input value={contactCompany} onChange={(e) => setContactCompany(e.target.value)} required placeholder="Jemmia Diamond..." />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Email Công Việc</label>
                <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required placeholder="contact@company.vn" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Nội Dung Yêu Cầu Tích Hợp</label>
                <textarea
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  rows={4}
                  required
                  placeholder="Mô tả hệ thống CRM/ERP hiện tại cần kết nối..."
                  className="w-full rounded-2xl border border-slate-300 bg-white/70 p-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-100"
                />
              </div>

              <Button type="submit" variant="gradient" className="w-full h-11 text-sm font-bold flex items-center justify-center gap-2">
                <Send className="h-4 w-4" /> Gửi Yêu Cầu Liên Hệ
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
