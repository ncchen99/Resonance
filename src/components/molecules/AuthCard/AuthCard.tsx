import type { ReactNode } from 'react';

export function AuthCard({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 420,
        padding: '36px 32px',
        borderRadius: '26px 28px 24px 30px',
        background: 'var(--color-card-bg)',
        border: '1px solid oklch(82% 0.02 75)',
        boxShadow: '0 4px 24px oklch(20% 0.04 60 / 0.08)',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 26,
          fontWeight: 700,
          marginBottom: 24,
          color: 'var(--color-text)',
        }}
      >
        {title}
      </h1>
      {children}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label style={{ display: 'block', marginBottom: 16 }}>
      <span
        style={{
          display: 'block',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
          marginBottom: 6,
        }}
      >
        {label}
      </span>
      {children}
      {hint && (
        <span
          style={{
            display: 'block',
            marginTop: 4,
            fontSize: 12,
            color: 'var(--color-text-muted)',
          }}
        >
          {hint}
        </span>
      )}
    </label>
  );
}

export const authInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: 12,
  border: '1px solid oklch(82% 0.02 75)',
  background: 'var(--color-cream)',
  fontFamily: 'var(--font-body)',
  fontSize: 15,
  color: 'var(--color-text)',
};
