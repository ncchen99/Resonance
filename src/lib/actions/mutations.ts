'use server';

import { revalidatePath } from 'next/cache';
import { repos, CURRENT_USER_ID } from '@/lib/db';
import type { NewCard, Visibility, Locale } from '@/lib/db/types';

export async function markNotificationRead(id: string) {
  await repos.notification.markRead(id);
}

export async function toggleResonance(cardId: string, currentlyOn: boolean, note?: string) {
  if (currentlyOn) {
    await repos.resonance.unmark(cardId, CURRENT_USER_ID);
  } else {
    await repos.resonance.mark(cardId, CURRENT_USER_ID, note);
  }
  revalidatePath(`/card/${cardId}`);
}

export async function createCardDraft(input: {
  thoughtCore: string;
  story: string;
  tags: string[];
  visibility: Visibility;
  originalLocale: Locale;
}) {
  const data: NewCard = {
    authorId: CURRENT_USER_ID,
    ...input,
  };
  const card = await repos.card.create(data);
  return card;
}

export async function publishCard(id: string) {
  const card = await repos.card.publish(id);
  revalidatePath('/me');
  revalidatePath('/home');
  return card;
}

export async function sendInvite(input: {
  toUserId: string;
  message: string;
  referenceCardId?: string;
}) {
  const inv = await repos.invite.send({
    fromUserId: CURRENT_USER_ID,
    ...input,
  });
  return inv;
}

export async function updateProfile(patch: {
  handle?: string;
  bio?: string;
  region?: string;
  primaryLocale?: Locale;
  autoTranslateTo?: Locale[];
}) {
  const u = await repos.user.updateCurrent(patch);
  revalidatePath('/me');
  revalidatePath('/settings');
  return u;
}
