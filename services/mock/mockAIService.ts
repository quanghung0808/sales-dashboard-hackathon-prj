import { Conversation, Customer, Order } from '@/types';

export interface CopilotHeroSummaryParams {
  salesName: string;
  kpiPercent: number;
  revenue: number;
  targetRevenue: number;
  highProbabilityCount: number;
  pendingFollowupCount: number;
  pendingOrderCount: number;
  projectedKpi: number;
  dateRangeLabel?: string;
}

export class MockAIService {
  private static delay(ms = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async generateCopilotHeroSummary(params: CopilotHeroSummaryParams): Promise<{
    greeting: string;
    kpiStatement: string;
    highlights: {
      highProbText: string;
      followupText: string;
      pendingOrdersText: string;
    };
    projectionText: string;
  }> {
    await this.delay(250);
    const {
      salesName,
      kpiPercent,
      revenue,
      highProbabilityCount,
      pendingFollowupCount,
      pendingOrderCount,
      projectedKpi,
      dateRangeLabel = 'tháng này',
    } = params;

    const hour = new Date().getHours();
    const greetingTime = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

    const greetingVariations = [
      `👋 ${greetingTime}, ${salesName}!`,
      `✨ Xin chào ${salesName}, chúc bạn một ngày làm việc bùng nổ doanh số!`,
      `🚀 ${greetingTime} ${salesName}, Trợ lý AI Pilot đã sẵn sàng hỗ trợ bạn!`,
    ];

    const kpiVariations = [
      `Bạn đã đạt ${kpiPercent}% chỉ tiêu KPI ${dateRangeLabel} (${(revenue / 1000000).toLocaleString('vi-VN')}tr VNĐ).`,
      `Tiến độ KPI ${dateRangeLabel} của bạn đạt ${kpiPercent}%, vượt 14% so với mốc cùng kỳ.`,
      `Hiệu suất kinh doanh ${dateRangeLabel} đang ở mức ấn tượng ${kpiPercent}% chỉ tiêu.`,
    ];

    const randomGreeting = greetingVariations[Math.floor(Math.random() * greetingVariations.length)];
    const randomKpiStatement = kpiVariations[Math.floor(Math.random() * kpiVariations.length)];

    return {
      greeting: randomGreeting,
      kpiStatement: randomKpiStatement,
      highlights: {
        highProbText: `🔥 ${highProbabilityCount} khách hàng có xác suất chốt đơn cao (>90%).`,
        followupText: `📞 ${pendingFollowupCount} khách hàng cần liên hệ chăm sóc lại hôm nay.`,
        pendingOrdersText: `⚠️ ${pendingOrderCount} đơn hàng đang chờ xác nhận cọc thanh toán.`,
      },
      projectionText: `Nếu hoàn thành các nhiệm vụ ưu tiên hôm nay, bạn dự kiến đạt ${projectedKpi}% chỉ tiêu KPI ${dateRangeLabel}!`,
    };
  }

  static async generateDashboardSummary(salesName: string, kpiAchieved: number, revenue: number) {
    await this.delay(200);
    const greetingTime = new Date().getHours() < 12 ? 'Chào buổi sáng' : 'Chào buổi chiều';
    const formattedRevenue = (revenue / 1000000).toLocaleString('vi-VN') + 'tr';

    const templates = [
      `🌟 ${greetingTime} ${salesName}! Bạn đã hoàn thành ${kpiAchieved}% chỉ tiêu KPI tháng này với tổng doanh thu ${formattedRevenue}. Doanh số ghi nhận tăng 15.4% so với tuần trước. Hiện bạn đang có 6 khách hàng tiềm năng VIP đang chờ phản hồi từ báo giá nhẫn kim cương GIA.`,
      `🔥 Ấn tượng tuyệt vời, ${salesName}! Bạn đang chạm mốc ${kpiAchieved}% KPI. Tỷ lệ chốt đơn thành công trong tuần đạt 34.8%. Hôm nay là thời điểm lý tưởng để hoàn tất 3 giao dịch chốt cọc trị giá trên 250 triệu.`,
      `🚀 ${greetingTime} ${salesName}, hiệu suất bán hàng của bạn rất vững chắc (${kpiAchieved}% chỉ tiêu). 4 khách hàng vừa mở tin nhắn tương tác lại trên Messenger. Cần ưu tiên chăm sóc khách hàng mua nhẫn cưới cặp!`
    ];

    const randomIdx = Math.floor(Math.random() * templates.length);
    return templates[randomIdx];
  }

  static async summarizeConversation(customerName: string, chatMessages: string[]) {
    await this.delay(250);
    const summaryTemplates = [
      `Khách hàng ${customerName} đang rất quan tâm đến dòng sản phẩm nhẫn kim cương tự nhiên 1 carat nước D. Khách mong muốn nhận thêm bản render 3D và chính sách thu đổi trả góp 0%. Khả năng chốt đơn cao nếu hỗ trợ voucher giảm giá 5%.`,
      `Khách hàng ${customerName} đã có trải nghiệm mua sắm trước đây, đang đắn đo giữa 2 mẫu bộ trang sức cưới Vàng 18k và Bạch Kim. Nhu cầu quà tặng kỷ niệm ngày cưới trong 3 ngày tới.`,
      `Khách hàng ${customerName} hỏi chi tiết về chứng thư kiểm định GIA và quy trình bảo hành làm sạch sản phẩm trọn đời. Thái độ tích cực, ưu tiên giải đáp thắc mắc bảo hành để chốt hợp đồng.`
    ];

    const randomIdx = Math.floor(Math.random() * summaryTemplates.length);
    return summaryTemplates[randomIdx];
  }

  static async generateDailySummary(salesName: string, todayOrdersCount: number, todayRevenue: number) {
    await this.delay(300);
    const formattedRev = (todayRevenue / 1000000).toLocaleString('vi-VN') + 'tr';

    return {
      title: '📊 Báo Cáo AI Daily Sales Summary (18:00)',
      salesName,
      revenueToday: formattedRev,
      ordersClosed: todayOrdersCount || 4,
      customersContacted: 18,
      missedFollowups: 2,
      performanceScore: 92,
      insights: [
        'Doanh số bán hàng hôm nay vượt 12% so với mục tiêu trung bình ngày.',
        'Khách hàng phản hồi rất tốt với chương trình tặng voucher 5,000,000đ.',
        'Tỷ lệ tương tác tin nhắn Messenger chốt đơn trong ngày đạt 85%.'
      ],
      tomorrowSuggestions: [
        '🔥 Gọi điện chăm sóc lại 2 khách hàng bỏ dở cuộc gọi chiều nay (Lan Anh & Đức Huy).',
        '💬 Chuẩn bị hợp đồng giao nhận nhẫn cưới #ORD-2045 trước 10:00 sáng.',
        '🎯 Gửi thiệp ưu đãi sinh nhật tháng 8 cho danh sách 15 khách hàng VIP.'
      ]
    };
  }

  static async generateSuggestedTasks(customerName?: string) {
    await this.delay(200);
    return [
      { id: 'suggest-1', title: `🔥 Call ${customerName || 'Nguyễn Văn Hải'}`, subtitle: 'Tư vấn ni tay nhẫn kim cương và chốt lịch hẹn trải nghiệm', priority: 'High' as const },
      { id: 'suggest-2', title: `🔥 Follow up customer Lan Anh`, subtitle: 'Gửi bảng chiết khấu trả góp 0% qua thẻ VCB', priority: 'High' as const },
      { id: 'suggest-3', title: `🔥 Send quotation to Đức Huy`, subtitle: 'Báo giá lắc tay kim cương 5.4mm nước D', priority: 'High' as const },
      { id: 'suggest-4', title: `🔥 Close pending order #ORD-2032`, subtitle: 'Nhắc khách gửi mã xác nhận cọc tiền', priority: 'Medium' as const },
      { id: 'suggest-5', title: `Thank VIP customer Minh Anh`, subtitle: 'Gửi thiệp mừng kèm mã giảm giá 10% dịp kỷ niệm', priority: 'Low' as const },
    ];
  }

  static async generateCustomerInsight(customer: Customer) {
    await this.delay(200);
    return {
      spendingPattern: `${customer.name} có thói quen mua sắm vào các dịp lễ kỷ niệm cuối năm. Tổng chi tiêu ${customer.totalSpent.toLocaleString('vi-VN')}đ đặt chị vào phân hạng ${customer.tier}.`,
      preferredProduct: customer.favoriteProduct,
      churnRisk: customer.totalSpent > 100000000 ? 'Low Risk (Thành viên trung thành)' : 'Medium Risk',
      recommendedNextProduct: customer.favoriteProduct === 'Diamond Ring' ? 'Earrings Diamond 4ly' : 'Bracelet Platinum',
      crossSellOpportunity: 'Đề xuất bộ trang sức đồng bộ (Matching Suite) giảm 8% khi mua kèm.'
    };
  }
}
