import {
  Company,
  CompanyAdmin,
  SalesRep,
  Customer,
  Conversation,
  Order,
  KPIMetric,
  CommissionRule,
  AISettings,
  NotificationItem,
  TaskItem,
  ChatMessage,
  CustomerTimelineEvent,
  SentimentType,
  IntentType,
  RiskLevel,
  OrderStatus
} from '@/types';

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp-1',
    name: 'Jemmia Diamond',
    logo: '💎',
    email: 'contact@jemmia.vn',
    phone: '0838 353 333',
    address: '72 Nguyễn Cư Trinh, Quận 1, TP. Hồ Chí Minh',
    industry: 'High-End Gemstone & Diamond',
    createdAt: '2023-01-15',
    status: 'active',
    salesCount: 22,
    totalRevenue: 4850000000,
  },
  {
    id: 'comp-2',
    name: 'Diamond World',
    logo: '👑',
    email: 'info@diamondworld.vn',
    phone: '1800 599 998',
    address: '150 Hai Bà Trưng, Quận 3, TP. Hồ Chí Minh',
    industry: 'Luxury Diamond Jewelry',
    createdAt: '2023-03-20',
    status: 'active',
    salesCount: 18,
    totalRevenue: 3920000000,
  },
  {
    id: 'comp-3',
    name: 'Luxury Jewelry Co.',
    logo: '✨',
    email: 'vip@luxuryjewelry.vn',
    phone: '028 3822 9999',
    address: '45 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội',
    industry: 'Bespoke Fine Jewelry',
    createdAt: '2023-05-10',
    status: 'active',
    salesCount: 16,
    totalRevenue: 3150000000,
  },
  {
    id: 'comp-4',
    name: 'Golden Ring Enterprise',
    logo: '💍',
    email: 'support@goldenring.vn',
    phone: '0236 388 7777',
    address: '88 Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
    industry: 'Wedding & Engagement Rings',
    createdAt: '2023-08-01',
    status: 'active',
    salesCount: 14,
    totalRevenue: 2400000000,
  },
  {
    id: 'comp-5',
    name: 'Shine Jewelry Studio',
    logo: '🌟',
    email: 'hello@shinejewelry.vn',
    phone: '0292 383 1111',
    address: '120 Trần Hưng Đạo, Ninh Kiều, Cần Thơ',
    industry: 'Fashion & Fine Gold',
    createdAt: '2023-11-12',
    status: 'active',
    salesCount: 10,
    totalRevenue: 1850000000,
  },
];

export const INITIAL_ADMINS: CompanyAdmin[] = [
  { id: 'admin-1', companyId: 'comp-1', companyName: 'Jemmia Diamond', name: 'Nguyễn Thanh Tùng', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tung', email: 'tung.nguyen@jemmia.vn', phone: '0909 111 222', createdAt: '2023-01-15' },
  { id: 'admin-2', companyId: 'comp-1', companyName: 'Jemmia Diamond', name: 'Đặng Ngọc Anh', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NgocAnh', email: 'ngocanh.dang@jemmia.vn', phone: '0909 111 333', createdAt: '2023-02-01' },
  { id: 'admin-3', companyId: 'comp-2', companyName: 'Diamond World', name: 'Trần Hoàng Nam', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HoangNam', email: 'nam.tran@diamondworld.vn', phone: '0909 222 111', createdAt: '2023-03-20' },
  { id: 'admin-4', companyId: 'comp-2', companyName: 'Diamond World', name: 'Lê Minh Hương', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MinhHuong', email: 'huong.le@diamondworld.vn', phone: '0909 222 444', createdAt: '2023-04-10' },
  { id: 'admin-5', companyId: 'comp-3', companyName: 'Luxury Jewelry Co.', name: 'Phạm Vũ Bảo', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VuBao', email: 'bao.pham@luxuryjewelry.vn', phone: '0909 333 555', createdAt: '2023-05-10' },
  { id: 'admin-6', companyId: 'comp-3', companyName: 'Luxury Jewelry Co.', name: 'Hoàng Bích Phương', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BichPhuong', email: 'phuong.hoang@luxuryjewelry.vn', phone: '0909 333 666', createdAt: '2023-06-01' },
  { id: 'admin-7', companyId: 'comp-4', companyName: 'Golden Ring Enterprise', name: 'Vũ Quốc Khánh', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=QuocKhanh', email: 'khanh.vu@goldenring.vn', phone: '0909 444 777', createdAt: '2023-08-01' },
  { id: 'admin-8', companyId: 'comp-4', companyName: 'Golden Ring Enterprise', name: 'Đỗ Thùy Trang', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ThuyTrang', email: 'trang.do@goldenring.vn', phone: '0909 444 888', createdAt: '2023-09-15' },
  { id: 'admin-9', companyId: 'comp-5', companyName: 'Shine Jewelry Studio', name: 'Bùi Đức Anh', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DucAnh', email: 'ducanh.bui@shinejewelry.vn', phone: '0909 555 999', createdAt: '2023-11-12' },
  { id: 'admin-10', companyId: 'comp-5', companyName: 'Shine Jewelry Studio', name: 'Ngô Thanh Hà', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ThanhHa', email: 'ha.ngo@shinejewelry.vn', phone: '0909 555 000', createdAt: '2023-12-05' },
];

const LAST_NAMES = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Võ', 'Hoàng', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngo', 'Dương'];
const MIDDLE_NAMES = ['Văn', 'Minh', 'Thị', 'Quốc', 'Hoàng', 'Phương', 'Bảo', 'Ngọc', 'Thanh', 'Khánh', 'Đức', 'Anh'];
const FIRST_NAMES = ['An', 'Đức', 'Hoa', 'Bảo', 'Quân', 'Trang', 'Long', 'Thảo', 'Hải', 'Huy', 'Lan', 'Nam', 'Kiên', 'Hương', 'Tú', 'Linh', 'Hùng', 'Sơn', 'Dũng', 'Vy'];
const DEPARTMENTS = ['Diamond Sales', 'VIP Consultation', 'Wedding Rings', 'Custom Design', 'Online Sales'];

export function generateMockSales(): SalesRep[] {
  const salesList: SalesRep[] = [];
  salesList.push({
    id: 'sales-1',
    companyId: 'comp-1',
    companyName: 'Jemmia Diamond',
    name: 'Nguyễn Văn An',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NguyenVanAn',
    email: 'an.nguyen@jemmia.vn',
    phone: '0912 345 678',
    department: 'VIP Consultation',
    joinDate: '2023-02-15',
    revenue: 350000000,
    kpiTarget: 450000000,
    kpiAchieved: 78,
    commission: 17500000,
    commissionRate: 4,
    activeLeadsCount: 14,
    createdAt: '2023-02-15',
  });

  for (let i = 2; i <= 80; i++) {
    const lastName = LAST_NAMES[i % LAST_NAMES.length];
    const middleName = MIDDLE_NAMES[i % MIDDLE_NAMES.length];
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const name = `${lastName} ${middleName} ${firstName}`;
    const companyIndex = (i % 5);
    const company = INITIAL_COMPANIES[companyIndex];
    const dept = DEPARTMENTS[i % DEPARTMENTS.length];
    const kpiAchieved = Math.floor(55 + (i * 7) % 70);
    const kpiTarget = 300000000 + (i % 5) * 50000000;
    const revenue = Math.floor((kpiTarget * kpiAchieved) / 100);
    const commRate = kpiAchieved >= 120 ? 0.08 : kpiAchieved >= 100 ? 0.05 : kpiAchieved >= 80 ? 0.03 : 0;
    const commission = Math.floor(revenue * commRate);
    const commissionRatePercent = Math.round(commRate * 100) || 4;

    salesList.push({
      id: `sales-${i}`,
      companyId: company.id,
      companyName: company.name,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Sales_${i}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${company.name.toLowerCase().replace(/[^a-z]/g, '')}.vn`,
      phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
      department: dept,
      joinDate: `2023-0${1 + (i % 9)}-${10 + (i % 18)}`,
      revenue,
      kpiTarget,
      kpiAchieved,
      commission,
      commissionRate: commissionRatePercent,
      activeLeadsCount: 5 + (i % 15),
      createdAt: `2023-0${1 + (i % 9)}-${10 + (i % 18)}`,
    });
  }
  return salesList;
}

const CITIES = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Nha Trang', 'Vũng Tàu', 'Bình Dương'];
const PRODUCTS = ['Diamond Ring', 'Wedding Ring', 'Earrings', 'Bracelet', 'Necklace', 'Pendant'];

export function generateMockCustomers(salesList: SalesRep[]): Customer[] {
  const customers: Customer[] = [];
  for (let i = 1; i <= 500; i++) {
    const lastName = LAST_NAMES[i % LAST_NAMES.length];
    const middleName = MIDDLE_NAMES[i % MIDDLE_NAMES.length];
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const name = `${lastName} ${middleName} ${firstName}`;
    const assignedSales = salesList[(i - 1) % salesList.length];
    const spent = Math.floor(15000000 + Math.random() * 450000000);
    const tier = spent > 300000000 ? 'VIP' : spent > 150000000 ? 'Gold' : spent > 50000000 ? 'Silver' : 'Standard';

    customers.push({
      id: `cust-${i}`,
      companyId: assignedSales.companyId,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Cust_${i}`,
      phone: `08${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: `customer.${i}@gmail.com`,
      birthday: `19${75 + (i % 25)}-0${1 + (i % 9)}-${10 + (i % 18)}`,
      city: CITIES[i % CITIES.length],
      totalSpent: spent,
      favoriteProduct: PRODUCTS[i % PRODUCTS.length],
      assignedSalesId: assignedSales.id,
      assignedSalesName: assignedSales.name,
      createdAt: `2026-0${1 + (i % 6)}-${10 + (i % 18)}`,
      tier,
    });
  }
  return customers;
}

export function generateMockOrders(customers: Customer[], salesList: SalesRep[]): Order[] {
  const orders: Order[] = [];
  const STATUS_WEIGHTS: OrderStatus[] = [
    'Completed', 'Completed', 'Completed', 'Completed',
    'Confirmed', 'Confirmed',
    'Shipping', 'Shipping',
    'Pending',
    'Cancelled',
    'Refunded'
  ];

  // Daily revenue per active day will total around 30M to 500M VND
  for (let i = 1; i <= 800; i++) {
    const customer = customers[(i - 1) % customers.length];
    const sales = salesList.find(s => s.id === customer.assignedSalesId) || salesList[0];
    const product = PRODUCTS[i % PRODUCTS.length];
    
    // Each individual order is between 25,000,000đ and 250,000,000đ
    const amount = Math.floor(25000000 + Math.random() * 225000000);
    const status = STATUS_WEIGHTS[i % STATUS_WEIGHTS.length];
    const commission = Math.floor(amount * 0.04);

    let dateStr = '2026-07-18';
    if (i <= 3) {
      // Today (2026-07-18): 2-3 orders totaling 180M - 350M VND (within 30M - 500M daily range!)
      dateStr = '2026-07-18';
    } else if (i <= 25) {
      // This Week (2026-07-13 to 2026-07-17): 3-4 orders per day totaling 70M - 420M per day
      const day = 13 + (i % 5);
      dateStr = `2026-07-${day < 10 ? '0' + day : day}`;
    } else if (i <= 150) {
      // This Month (2026-07-01 to 2026-07-12)
      const day = 1 + (i % 12);
      dateStr = `2026-07-${day < 10 ? '0' + day : day}`;
    } else if (i <= 450) {
      // Q2/Q3 2026
      const month = 4 + (i % 3);
      const day = 10 + (i % 18);
      dateStr = `2026-0${month}-${day}`;
    } else {
      // Months T1 to T3 2026
      const month = 1 + (i % 3);
      const day = 10 + (i % 18);
      dateStr = `2026-0${month}-${day}`;
    }

    orders.push({
      id: `ORD-${2000 + i}`,
      companyId: sales.companyId,
      customerId: customer.id,
      customerName: customer.name,
      salesId: sales.id,
      salesName: sales.name,
      product,
      amount,
      commission,
      status,
      createdAt: dateStr,
    });
  }
  return orders;
}

export function generateMockConversations(customers: Customer[], salesList: SalesRep[]): Conversation[] {
  const conversations: Conversation[] = [];
  const INTENTS: IntentType[] = [
    'High Purchase Intent',
    'Price Inquiry',
    'Custom Order',
    'After-Sales Support',
    'Price Hesitation'
  ];

  const SAMPLE_CHAT_PAIRS = [
    {
      c: 'Xin chào em, chiếc nhẫn kim cương 1 carat GIA nước D bên em giá bao nhiêu?',
      s: 'Dạ chào anh/chị, mẫu nhẫn kim cương 1 carat nước D VVS1 kiểm định GIA đang có giá ưu đãi khoảng 185 triệu ạ. Anh/chị ghé showroom bên em trải nghiệm kính hiển vi xem mã số cạnh nhé!',
      ai: 'Khách hàng quan tâm nhẫn kim cương 1 carat GIA nước D. Độ chín muồi cao, sẵn sàng chốt đơn trong tuần.',
      action: 'Gửi bảng báo giá chi tiết và mời đến Showroom Quận 1 trải nghiệm sản phẩm trực tiếp.'
    },
    {
      c: 'Mẫu nhẫn cưới Vĩnh Cửu này có làm bằng vàng trắng 18k được không?',
      s: 'Dạ hoàn toàn được ạ! Mẫu Vĩnh Cửu làm bằng vàng trắng 18k cao cấp kết hợp kim cương tự nhiên 3ly. Thời gian chế tác khoảng 5 ngày làm việc ạ.',
      ai: 'Khách tìm nhẫn cưới cặp vàng trắng 18k. Đang so sánh thời gian giao hàng và ưu đãi bảo hành.',
      action: 'Gửi 3 mẫu 3D render và hỗ trợ khắc tên miễn phí lên lòng nhẫn.'
    },
    {
      c: 'Bên mình có chính sách thu đổi kim cương cũ đổi sang mẫu lớn hơn không em?',
      s: 'Dạ Jemmia áp dụng chính sách thu đổi lên đến 95-98% giá trị kim cương GIA niêm yết ạ. Chị mang viên cũ qua em hỗ trợ định giá tức thì nha!',
      ai: 'Khách hàng VIP muốn nâng cấp viên kim cương từ 0.7ct lên 1.2ct. Giá trị tiềm năng > 300 triệu.',
      action: 'Lên lịch hẹn trao đổi trực tiếp với Chuyên viên tư vấn cao cấp tại phòng VIP.'
    },
    {
      c: 'Giá dây chuyền lắc tay bộ sưu tập Shine hơi cao so với ngân sách của anh.',
      s: 'Dạ em hiểu ạ. Hiện bên em đang áp dụng chương trình trả góp 0% qua thẻ tín dụng và tặng voucher 5 triệu cho hóa đơn trên 50 triệu ạ!',
      ai: 'Khách hàng đắn đo về giá nhưng thích mẫu sản phẩm. Rào cản là ngân sách tức thì.',
      action: 'Gửi phương án trả góp 0% lãi suất và đề xuất chiết khấu thêm 3% cho khách hàng mua hôm nay.'
    }
  ];

  for (let i = 1; i <= 2000; i++) {
    const customer = customers[(i - 1) % customers.length];
    const sales = salesList.find(s => s.id === customer.assignedSalesId) || salesList[0];
    const chatPair = SAMPLE_CHAT_PAIRS[i % SAMPLE_CHAT_PAIRS.length];
    const score = Math.floor(50 + ((i * 13) % 49));
    const sentiment = score > 80 ? 'Positive' : score > 65 ? 'Neutral' : 'Negative';
    const intent = INTENTS[i % INTENTS.length];
    const riskLevel = score > 80 ? 'Low' : score > 65 ? 'Medium' : 'High';
    const status = score > 85 ? 'Closed / Won' : score > 70 ? 'Open' : 'Pending Sales';

    const chatHistory: ChatMessage[] = [
      {
        id: `msg-${i}-1`,
        sender: 'customer',
        senderName: customer.name,
        message: chatPair.c,
        timestamp: `10:15 AM`,
      },
      {
        id: `msg-${i}-2`,
        sender: 'sales',
        senderName: sales.name,
        message: chatPair.s,
        timestamp: `10:18 AM`,
      },
      {
        id: `msg-${i}-3`,
        sender: 'ai',
        senderName: 'AI Sales Assistant',
        message: `💡 Phân tích AI: Ý định mua hàng đạt ${score}%. ${chatPair.ai}`,
        timestamp: `10:19 AM`,
      }
    ];

    conversations.push({
      id: `CONV-${1000 + i}`,
      companyId: sales.companyId,
      customerId: customer.id,
      customerName: customer.name,
      customerAvatar: customer.avatar,
      customerPhone: customer.phone,
      assignedSalesId: sales.id,
      assignedSalesName: sales.name,
      score,
      sentiment,
      intent,
      riskLevel,
      chatHistory,
      aiSummary: chatPair.ai,
      nextAction: chatPair.action,
      status,
      updatedAt: `2026-07-${10 + (i % 8)} 14:30`,
      lastMessage: chatPair.s,
      createdAt: `2026-07-${10 + (i % 8)}`,
    });
  }

  return conversations;
}

export const INITIAL_KPI_METRICS: KPIMetric[] = [
  {
    id: 'kpi-2026-year',
    companyId: 'comp-1',
    periodType: 'yearly',
    periodName: 'Year 2026',
    revenueTarget: 5000000000,
    revenueAchieved: 3950000000,
    ordersTarget: 1000,
    ordersAchieved: 820,
    customersTarget: 600,
    customersAchieved: 510,
    conversionTarget: 32,
    conversionAchieved: 29.5,
    repeatCustomersTarget: 40,
    repeatCustomersAchieved: 42.1,
    createdAt: '2026-01-01',
  },
  {
    id: 'kpi-2026-q3',
    companyId: 'comp-1',
    periodType: 'quarterly',
    periodName: 'Q3 2026',
    revenueTarget: 1350000000,
    revenueAchieved: 1050000000,
    ordersTarget: 260,
    ordersAchieved: 215,
    customersTarget: 150,
    customersAchieved: 132,
    conversionTarget: 30,
    conversionAchieved: 28.4,
    repeatCustomersTarget: 38,
    repeatCustomersAchieved: 40.5,
    createdAt: '2026-07-01',
  },
  {
    id: 'kpi-2026-07',
    companyId: 'comp-1',
    periodType: 'monthly',
    periodName: 'July 2026',
    revenueTarget: 450000000,
    revenueAchieved: 351000000,
    ordersTarget: 90,
    ordersAchieved: 74,
    customersTarget: 50,
    customersAchieved: 42,
    conversionTarget: 30,
    conversionAchieved: 27.8,
    repeatCustomersTarget: 35,
    repeatCustomersAchieved: 38.2,
    createdAt: '2026-07-01',
  }
];

export const INITIAL_COMMISSION_RULES: CommissionRule[] = [
  { id: 'comm-1', companyId: 'comp-1', minKpiPercent: 0, maxKpiPercent: 80, commissionRate: 0, label: '<80% KPI', createdAt: '2026-01-01' },
  { id: 'comm-2', companyId: 'comp-1', minKpiPercent: 80, maxKpiPercent: 100, commissionRate: 3, label: '80% - 100% KPI', createdAt: '2026-01-01' },
  { id: 'comm-3', companyId: 'comp-1', minKpiPercent: 100, maxKpiPercent: 120, commissionRate: 5, label: '100% - 120% KPI', createdAt: '2026-01-01' },
  { id: 'comm-4', companyId: 'comp-1', minKpiPercent: 120, maxKpiPercent: null, commissionRate: 8, label: '>120% KPI', createdAt: '2026-01-01' },
];

export const INITIAL_AI_SETTINGS: AISettings = {
  openaiApiKey: 'sk-proj-9847192837192837192837',
  geminiApiKey: 'AIzaSyD-847291847291847291',
  claudeApiKey: 'sk-ant-api03-847291847291',
  selectedModel: 'GPT-5',
  autoSummaryTime: '18:00',
  leadScoringEnabled: true,
};

export const INITIAL_TASKS: TaskItem[] = [
  { id: 'task-1', title: '🔥 Call Nguyễn Văn Hải', subtitle: 'Hỏi cảm nhận viên kim cương 1.2ct sau 3 ngày mua', priority: 'High', completed: false, dueDate: 'Today, 2:00 PM', customerId: 'cust-1' },
  { id: 'task-2', title: '🔥 Follow up customer Lan Anh', subtitle: 'Khách đang đắn đo mẫu nhẫn cưới Vĩnh Cửu 18k', priority: 'High', completed: false, dueDate: 'Today, 3:30 PM', customerId: 'cust-2' },
  { id: 'task-3', title: '🔥 Send quotation to Đức Huy', subtitle: 'Báo giá lắc tay kim cương 5.4mm nước D', priority: 'High', completed: false, dueDate: 'Today, 4:15 PM', customerId: 'cust-3' },
  { id: 'task-4', title: '🔥 Close pending order #ORD-2032', subtitle: 'Chờ khách chuyển khoản cọc 30%', priority: 'High', completed: false, dueDate: 'Today, 5:00 PM', orderId: 'ORD-2032' },
  { id: 'task-5', title: 'Thank VIP customer Minh Anh', subtitle: 'Gửi thiệp chúc mừng sinh nhật kèm quà tri ân VIP', priority: 'Medium', completed: true, dueDate: 'Completed', customerId: 'cust-4' },
  { id: 'task-6', title: 'Review monthly sales quota', subtitle: 'Cập nhật lại dự báo doanh số tuần 4', priority: 'Low', completed: false, dueDate: 'Tomorrow, 9:00 AM' },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'notif-1', title: '🎯 KPI Reached 78%', message: 'Nguyễn Văn An vừa đạt 78% chỉ tiêu doanh số tháng 7/2026!', type: 'kpi', timestamp: '10 phút trước', read: false },
  { id: 'notif-2', title: '👤 Khách hàng VIP mới', message: 'Khách hàng Phạm Minh Tuấn (VIP) được gán cho bạn.', type: 'customer', timestamp: '1 giờ trước', read: false },
  { id: 'notif-3', title: '💰 Đơn hàng mới #ORD-2088', message: 'Đơn hàng 145,000,000đ đã được thanh toán thành công.', type: 'order', timestamp: '3 giờ trước', read: true },
  { id: 'notif-4', title: '🤖 Báo cáo AI Daily Summary', message: 'Báo cáo tổng hợp doanh số và hiệu suất ngày 18/07 đã sẵn sàng.', type: 'ai_summary', timestamp: 'Hôm qua', read: true },
];

export const MOCK_TIMELINE_EVENTS: CustomerTimelineEvent[] = [
  { id: 'evt-1', date: '2026-07-01 09:30', title: 'Lead Created', description: 'Khách hàng để lại thông tin từ Facebook Ads Jemmia Diamond', salesOwner: 'Nguyễn Văn An', type: 'lead' },
  { id: 'evt-2', date: '2026-07-01 10:15', title: 'Messenger Chat', description: 'Tư vấn chi tiết về nước nước D kim cương 1ct và giấy kiểm định GIA', salesOwner: 'Nguyễn Văn An', type: 'chat' },
  { id: 'evt-3', date: '2026-07-02 14:00', title: 'Phone Call', description: 'Gọi điện chốt lịch hẹn trải nghiệm trực tiếp tại Showroom Q1', salesOwner: 'Nguyễn Văn An', type: 'call' },
  { id: 'evt-4', date: '2026-07-03 16:30', title: 'Store Visit', description: 'Khách ghé Showroom thử nhẫn và soi mã số kim cương qua kính hiển vi', salesOwner: 'Nguyễn Văn An', type: 'visit' },
  { id: 'evt-5', date: '2026-07-03 17:15', title: 'Quotation Sent', description: 'Gửi bản báo giá chính thức kèm ưu đãi voucher 5,000,000đ', salesOwner: 'Nguyễn Văn An', type: 'quotation' },
  { id: 'evt-6', date: '2026-07-04 11:00', title: 'Order Created', description: 'Tạo đơn hàng #ORD-2045 trị giá 185,000,000đ', salesOwner: 'Nguyễn Văn An', type: 'order' },
  { id: 'evt-7', date: '2026-07-04 11:30', title: 'Payment Confirmed', description: 'Đã nhận chuyển khoản cọc 50% qua ngân hàng VCB', salesOwner: 'Nguyễn Văn An', type: 'payment' },
  { id: 'evt-8', date: '2026-07-07 15:00', title: 'Warranty & Delivery', description: 'Bàn giao nhẫn tận tay kèm sổ bảo hành trọn đời & chứng thư GIA', salesOwner: 'Nguyễn Văn An', type: 'warranty' },
];
