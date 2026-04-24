'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { OrganicButton } from '@/components/atoms/OrganicButton/OrganicButton';
import { AuthCard, Field, authInputStyle } from '@/components/molecules/AuthCard/AuthCard';
import { HandDrawnCheckmark } from '@/components/atoms/HandDrawnCheckmark/HandDrawnCheckmark';
import { repos } from '@/lib/db';

type Step = 1 | 2 | 3;

export default function SignUpPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [handle, setHandle] = useState('');
  const [region, setRegion] = useState('TW');
  const [primaryLocale, setPrimaryLocale] = useState<'en' | 'zh-TW'>('zh-TW');
  const [handleState, setHandleState] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  useEffect(() => {
    if (step !== 3 || handle.length < 2) {
      setHandleState('idle');
      return;
    }
    setHandleState('checking');
    const h = setTimeout(async () => {
      const ok = await repos.user.isHandleAvailable(handle);
      setHandleState(ok ? 'available' : 'taken');
    }, 350);
    return () => clearTimeout(h);
  }, [handle, step]);

  return (
    <AuthCard title={t('signUpTitle')}>
      <div
        style={{
          fontSize: 12,
          color: 'var(--color-text-muted)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: 18,
        }}
      >
        {t('step', { current: step, total: 3 })} ·{' '}
        {step === 1 ? t('stepEmail') : step === 2 ? t('stepPhone') : t('stepHandle')}
      </div>

      {step === 1 && (
        <>
          <Field label={t('email')}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={authInputStyle}
            />
          </Field>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <div
              style={{
                opacity: email.includes('@') ? 1 : 0.5,
                pointerEvents: email.includes('@') ? 'auto' : 'none',
              }}
            >
              <OrganicButton variant="primary" onClick={() => setStep(2)}>
                {t('next')}
              </OrganicButton>
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <Field label={t('phoneLabel')} hint={t('phoneHint')}>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={authInputStyle}
              placeholder="+886 ..."
            />
          </Field>
          <Field label={t('otpLabel')}>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                style={{ ...authInputStyle, letterSpacing: '0.4em', textAlign: 'center' }}
                placeholder="· · · · · ·"
              />
              <OrganicButton variant="outline">{t('otpSend')}</OrganicButton>
            </div>
          </Field>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
            <OrganicButton variant="ghost" onClick={() => setStep(1)}>
              {t('back')}
            </OrganicButton>
            <div
              style={{
                opacity: otp.length === 6 ? 1 : 0.5,
                pointerEvents: otp.length === 6 ? 'auto' : 'none',
              }}
            >
              <OrganicButton variant="primary" onClick={() => setStep(3)}>
                {t('next')}
              </OrganicButton>
            </div>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <Field label={t('handleLabel')}>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value.slice(0, 20))}
              style={authInputStyle}
            />
            <div style={{ marginTop: 6, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              {handleState === 'checking' && (
                <span style={{ color: 'var(--color-text-muted)' }}>{t('handleChecking')}</span>
              )}
              {handleState === 'available' && (
                <span style={{ color: 'var(--color-sage, oklch(55% 0.13 140))', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <HandDrawnCheckmark size={12} /> {t('handleAvailable')}
                </span>
              )}
              {handleState === 'taken' && (
                <span style={{ color: 'var(--color-terracotta)' }}>{t('handleTaken')}</span>
              )}
            </div>
          </Field>

          <Field label={t('regionLabel')}>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              style={{ ...authInputStyle, appearance: 'none' }}
            >
              <option value="TW">🇹🇼 Taiwan</option>
              <option value="JP">🇯🇵 Japan</option>
              <option value="US">🇺🇸 United States</option>
              <option value="KR">🇰🇷 Korea</option>
              <option value="HK">🇭🇰 Hong Kong</option>
            </select>
          </Field>

          <Field label={t('primaryLocaleLabel')}>
            <select
              value={primaryLocale}
              onChange={(e) => setPrimaryLocale(e.target.value as 'en' | 'zh-TW')}
              style={{ ...authInputStyle, appearance: 'none' }}
            >
              <option value="zh-TW">繁體中文</option>
              <option value="en">English</option>
            </select>
          </Field>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
            <OrganicButton variant="ghost" onClick={() => setStep(2)}>
              {t('back')}
            </OrganicButton>
            <div
              style={{
                opacity: handleState === 'available' ? 1 : 0.5,
                pointerEvents: handleState === 'available' ? 'auto' : 'none',
              }}
            >
              <OrganicButton variant="primary" onClick={() => router.push('/write')}>
                {t('finish')}
              </OrganicButton>
            </div>
          </div>
        </>
      )}

      <p
        style={{
          marginTop: 24,
          paddingTop: 20,
          borderTop: '1px solid oklch(85% 0.02 75)',
          fontSize: 14,
          color: 'var(--color-text-muted)',
        }}
      >
        {t('switchToSignIn')}{' '}
        <Link href="/signin" style={{ color: 'var(--color-terracotta)' }}>
          {t('signIn')}
        </Link>
      </p>
    </AuthCard>
  );
}
