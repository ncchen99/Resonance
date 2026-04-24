import { CURRENT_USER_ID, USERS } from '@/lib/mock/data';
import type { User } from '../types';
import type { IUserRepository } from '../interfaces';

export class MockUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    return USERS.find((u) => u.id === id) ?? null;
  }

  async findByHandle(handle: string): Promise<User | null> {
    const normalized = handle.toLowerCase();
    return USERS.find((u) => u.handle.toLowerCase() === normalized) ?? null;
  }

  async getCurrent(): Promise<User | null> {
    return USERS.find((u) => u.id === CURRENT_USER_ID) ?? null;
  }

  async updateCurrent(patch: Partial<User>): Promise<User> {
    const idx = USERS.findIndex((u) => u.id === CURRENT_USER_ID);
    if (idx < 0) throw new Error('Current user missing in mock');
    USERS[idx] = { ...USERS[idx], ...patch };
    return USERS[idx];
  }

  async isHandleAvailable(handle: string): Promise<boolean> {
    const u = await this.findByHandle(handle);
    return !u || u.id === CURRENT_USER_ID;
  }
}
