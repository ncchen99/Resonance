import { NOTIFICATIONS } from '@/lib/mock/data';
import type { Notification } from '../types';
import type { INotificationRepository } from '../interfaces';

export class MockNotificationRepository implements INotificationRepository {
  async list(userId: string, limit = 20): Promise<Notification[]> {
    return NOTIFICATIONS.filter((n) => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async unreadCount(userId: string): Promise<number> {
    return NOTIFICATIONS.filter((n) => n.userId === userId && n.readAt === null).length;
  }

  async markRead(id: string): Promise<void> {
    const n = NOTIFICATIONS.find((x) => x.id === id);
    if (n && n.readAt === null) n.readAt = new Date();
  }
}
