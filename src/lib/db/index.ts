import type {
  ICardRepository,
  IConnectionRepository,
  IInviteRepository,
  INotificationRepository,
  IResonanceRepository,
  IUserRepository,
} from './interfaces';
import { MockCardRepository } from './mock/card';
import { MockUserRepository } from './mock/user';
import { MockConnectionRepository } from './mock/connection';
import { MockInviteRepository } from './mock/invite';
import { MockResonanceRepository } from './mock/resonance';
import { MockNotificationRepository } from './mock/notification';

const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK === undefined
    ? true
    : process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

export interface Repos {
  card: ICardRepository;
  user: IUserRepository;
  connection: IConnectionRepository;
  invite: IInviteRepository;
  resonance: IResonanceRepository;
  notification: INotificationRepository;
}

function buildRepos(): Repos {
  if (USE_MOCK) {
    return {
      card: new MockCardRepository(),
      user: new MockUserRepository(),
      connection: new MockConnectionRepository(),
      invite: new MockInviteRepository(),
      resonance: new MockResonanceRepository(),
      notification: new MockNotificationRepository(),
    };
  }
  throw new Error(
    'Firestore repositories not yet implemented. Set NEXT_PUBLIC_USE_MOCK=true.'
  );
}

export const repos: Repos = buildRepos();

export { CURRENT_USER_ID } from '@/lib/mock/data';
export type * from './types';
export type * from './interfaces';
