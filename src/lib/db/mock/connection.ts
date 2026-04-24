import { CONNECTIONS, USERS } from '@/lib/mock/data';
import type { Connection, User } from '../types';
import type { IConnectionRepository } from '../interfaces';

export class MockConnectionRepository implements IConnectionRepository {
  async isConnected(a: string, b: string): Promise<boolean> {
    return CONNECTIONS.some(
      (c) =>
        (c.userIds[0] === a && c.userIds[1] === b) ||
        (c.userIds[0] === b && c.userIds[1] === a)
    );
  }

  async list(userId: string): Promise<Connection[]> {
    return CONNECTIONS.filter((c) => c.userIds.includes(userId));
  }

  async listMutuals(userId: string): Promise<User[]> {
    const conns = await this.list(userId);
    const ids = conns.map((c) => (c.userIds[0] === userId ? c.userIds[1] : c.userIds[0]));
    return USERS.filter((u) => ids.includes(u.id));
  }

  async sever(a: string, b: string): Promise<void> {
    const idx = CONNECTIONS.findIndex(
      (c) =>
        (c.userIds[0] === a && c.userIds[1] === b) ||
        (c.userIds[0] === b && c.userIds[1] === a)
    );
    if (idx >= 0) CONNECTIONS.splice(idx, 1);
  }
}
