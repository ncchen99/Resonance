'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { OrganicButton } from '@/components/atoms/OrganicButton/OrganicButton';
import { ConnectInviteModal } from './ConnectInviteModal';

export interface ConnectInviteLauncherProps {
  targetUser: { id: string; handle: string; initials: string; accentColor: string };
  referenceCardId?: string;
  dailyRemaining?: number;
  variant?: 'primary' | 'outline' | 'ghost';
  label?: string;
}

export function ConnectInviteLauncher({
  targetUser,
  referenceCardId,
  dailyRemaining = 3,
  variant = 'outline',
  label,
}: ConnectInviteLauncherProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('card');
  return (
    <>
      <OrganicButton variant={variant} onClick={() => setOpen(true)}>
        {label ?? t('initiateConnect')}
      </OrganicButton>
      <ConnectInviteModal
        open={open}
        onClose={() => setOpen(false)}
        target={targetUser}
        referenceCardId={referenceCardId}
        dailyRemaining={dailyRemaining}
      />
    </>
  );
}
