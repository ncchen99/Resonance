import { CONNECTIONS, INVITES } from '@/lib/mock/data';
import type { Connection, Invite, NewInvite } from '../types';
import type { IInviteRepository } from '../interfaces';

const DAILY_QUOTA = 3;

export class MockInviteRepository implements IInviteRepository {
  async send(input: NewInvite): Promise<Invite> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sentToday = INVITES.filter(
      (i) => i.fromUserId === input.fromUserId && i.createdAt >= today
    ).length;
    if (sentToday >= DAILY_QUOTA) {
      throw new Error('Daily invite quota exceeded');
    }
    const inv: Invite = {
      id: `inv-${Math.random().toString(36).slice(2, 9)}`,
      ...input,
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 86_400_000),
      createdAt: new Date(),
    };
    INVITES.push(inv);
    return inv;
  }

  async accept(id: string, userId: string): Promise<Connection> {
    const inv = INVITES.find((i) => i.id === id);
    if (!inv) throw new Error(`Invite ${id} not found`);
    if (inv.toUserId !== userId) throw new Error('Not recipient');
    inv.status = 'accepted';
    const existing = CONNECTIONS.find(
      (c) =>
        c.userIds.includes(inv.fromUserId) && c.userIds.includes(inv.toUserId)
    );
    if (existing) return existing;
    const pair: [string, string] = [inv.fromUserId, inv.toUserId].sort() as [string, string];
    const conn: Connection = {
      id: pair.join('_'),
      userIds: pair,
      establishedAt: new Date(),
    };
    CONNECTIONS.push(conn);
    return conn;
  }

  async expire(id: string): Promise<void> {
    const inv = INVITES.find((i) => i.id === id);
    if (inv) inv.status = 'expired';
  }

  async withdraw(id: string, userId: string): Promise<void> {
    const inv = INVITES.find((i) => i.id === id);
    if (!inv || inv.fromUserId !== userId) return;
    inv.status = 'withdrawn';
  }

  async listPending(userId: string): Promise<Invite[]> {
    return INVITES.filter((i) => i.toUserId === userId && i.status === 'pending');
  }

  async remainingDailyQuota(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const used = INVITES.filter(
      (i) => i.fromUserId === userId && i.createdAt >= today
    ).length;
    return Math.max(0, DAILY_QUOTA - used);
  }
}
