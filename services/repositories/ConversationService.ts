import { Conversation, ChatMessage } from '@/types';
import { getItem, setItem, KEYS } from '@/lib/storage';

export class ConversationService {
  private static async delay(ms = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async getAllConversations(salesId?: string): Promise<Conversation[]> {
    await this.delay();
    const convs = getItem<Conversation[]>(KEYS.CONVERSATIONS, []);
    return salesId ? convs.filter((c) => c.assignedSalesId === salesId) : convs;
  }

  static async getConversationById(id: string): Promise<Conversation | null> {
    await this.delay();
    const convs = getItem<Conversation[]>(KEYS.CONVERSATIONS, []);
    return convs.find((c) => c.id === id) || null;
  }

  static async sendMessage(conversationId: string, messageText: string, sender: 'sales' | 'customer' | 'ai', senderName: string): Promise<Conversation> {
    await this.delay(200);
    const convs = getItem<Conversation[]>(KEYS.CONVERSATIONS, []);
    const index = convs.findIndex((c) => c.id === conversationId);
    if (index === -1) throw new Error('Conversation not found');

    const conv = convs[index];
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender,
      senderName,
      message: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedChat = [...conv.chatHistory, newMsg];
    const updatedConv: Conversation = {
      ...conv,
      chatHistory: updatedChat,
      lastMessage: messageText,
      updatedAt: new Date().toLocaleString(),
    };

    convs[index] = updatedConv;
    setItem(KEYS.CONVERSATIONS, convs);
    return updatedConv;
  }
}
