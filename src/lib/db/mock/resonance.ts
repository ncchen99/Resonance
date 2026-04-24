import { CARDS, RESONANCES } from '@/lib/mock/data';
import type { Card } from '../types';
import type { IResonanceRepository } from '../interfaces';

export class MockResonanceRepository implements IResonanceRepository {
  async mark(cardId: string, userId: string, note?: string): Promise<void> {
    const existing = RESONANCES.find((r) => r.cardId === cardId && r.userId === userId);
    if (existing) {
      if (note !== undefined) existing.note = note;
      return;
    }
    RESONANCES.push({
      id: `r-${Math.random().toString(36).slice(2, 9)}`,
      cardId,
      userId,
      note,
      createdAt: new Date(),
    });
    const card = CARDS.find((c) => c.id === cardId);
    if (card) card.resonanceCount += 1;
  }

  async unmark(cardId: string, userId: string): Promise<void> {
    const idx = RESONANCES.findIndex((r) => r.cardId === cardId && r.userId === userId);
    if (idx < 0) return;
    RESONANCES.splice(idx, 1);
    const card = CARDS.find((c) => c.id === cardId);
    if (card && card.resonanceCount > 0) card.resonanceCount -= 1;
  }

  async hasResonated(cardId: string, userId: string): Promise<boolean> {
    return RESONANCES.some((r) => r.cardId === cardId && r.userId === userId);
  }

  async listResonated(userId: string): Promise<Card[]> {
    const ids = RESONANCES.filter((r) => r.userId === userId).map((r) => r.cardId);
    return CARDS.filter((c) => ids.includes(c.id));
  }
}
