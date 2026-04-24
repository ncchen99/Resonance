'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import { OrganicButton } from '@/components/atoms/OrganicButton/OrganicButton';
import { AuthCard, Field, authInputStyle } from '@/components/molecules/AuthCard/AuthCard';

export default function SignInPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <AuthCard title={t('signInTitle')}>
      <Field label={t('email')}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={authInputStyle}
        />
      </Field>
      <Field label={t('password')}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={authInputStyle}
        />
      </Field>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <OrganicButton variant="primary" onClick={() => router.push('/home')}>
          {t('signIn')}
        </OrganicButton>
        <OrganicButton variant="ghost">{t('magicLink')}</OrganicButton>
      </div>
      <p
        style={{
          marginTop: 24,
          paddingTop: 20,
          borderTop: '1px solid oklch(85% 0.02 75)',
          fontSize: 14,
          color: 'var(--color-text-muted)',
        }}
      >
        {t('switchToSignUp')}{' '}
        <Link href="/signup" style={{ color: 'var(--color-terracotta)' }}>
          {t('signUp')}
        </Link>
      </p>
    </AuthCard>
  );
}
