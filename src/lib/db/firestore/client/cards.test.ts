import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./init', () => ({ getClientDb: vi.fn(() => ({})) }));

const mockAuth = { currentUser: { uid: 'me' } as { uid: string } | null };
vi.mock('@/lib/auth/firebase/client', () => ({
  getFirebaseClientAuth: vi.fn(() => mockAuth),
}));
vi.mock('firebase/firestore', () => ({
  addDoc: vi.fn(),
  collection: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(() => ({})),
  getDoc: vi.fn(),
  serverTimestamp: vi.fn(() => '<server-time>'),
  setDoc: vi.fn(),
  Timestamp: class {},
}));

import { getDoc, setDoc } from 'firebase/firestore';
import { publishCard } from './cards';

function snapshot(publishedAt: unknown) {
  return {
    id: 'card-1',
    exists: () => true,
    data: () => ({ authorId: 'me', publishedAt }),
  } as never;
}

beforeEach(() => {
  vi.clearAllMocks();
  mockAuth.currentUser = { uid: 'me' };
});

describe('publishCard', () => {
  it('stamps publishedAt the first time a card goes out', async () => {
    vi.mocked(getDoc).mockResolvedValue(snapshot(null));
    await publishCard('card-1');
    expect(vi.mocked(setDoc).mock.calls[0][1]).toMatchObject({
      publishedAt: '<server-time>',
    });
  });

  // Regression: re-stamping an already-published card re-dates it. Every feed
  // orders by publishedAt, so a typo fix would shove the card back to the top
  // of everyone's home page and change the date shown on the card.
  it('leaves publishedAt alone on a card that is already published', async () => {
    vi.mocked(getDoc).mockResolvedValue(snapshot(new Date('2026-01-02')));
    await publishCard('card-1');
    const patch = vi.mocked(setDoc).mock.calls[0][1] as Record<string, unknown>;
    expect(patch).not.toHaveProperty('publishedAt');
    expect(patch).toMatchObject({ updatedAt: '<server-time>' });
  });
});
