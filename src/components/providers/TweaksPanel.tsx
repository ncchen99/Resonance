'use client';

import { useEffect, useState } from 'react';

const TWEAK_DEFAULTS = {
  accentColor: 'terracotta',
  cardDensity: 'compact',
  grainIntensity: 2,
};

const ACCENT_MAP: Record<string, Record<string, string>> = {
  terracotta: {
    '--color-terracotta': 'oklch(62% 0.14 45)',
    '--color-terracotta-light': 'oklch(88% 0.08 55)',
  },
  sage: {
    '--color-terracotta': 'oklch(55% 0.13 140)',
    '--color-terracotta-light': 'oklch(80% 0.09 140)',
  },
  lavender: {
    '--color-terracotta': 'oklch(58% 0.14 290)',
    '--color-terracotta-light': 'oklch(83% 0.08 290)',
  },
  yellow: {
    '--color-terracotta': 'oklch(68% 0.15 80)',
    '--color-terracotta-light': 'oklch(90% 0.10 85)',
  },
};

const DENSITY_MAP: Record<string, string> = {
  normal: 'repeat(auto-fill, minmax(300px, 1fr))',
  compact: 'repeat(auto-fill, minmax(240px, 1fr))',
  airy: 'repeat(auto-fill, minmax(380px, 1fr))',
};

const GRAIN_MAP = [0, 0.055, 0.1, 0.18];

interface TweakState {
  accentColor: string;
  cardDensity: string;
  grainIntensity: number;
}

function applyTweaks(vals: TweakState) {
  const root = document.documentElement;
  const accent = ACCENT_MAP[vals.accentColor] || ACCENT_MAP.terracotta;
  Object.entries(accent).forEach(([k, v]) => root.style.setProperty(k, v));
  document.querySelectorAll<HTMLElement>('[data-card-grid]').forEach((el) => {
    el.style.gridTemplateColumns = DENSITY_MAP[vals.cardDensity] || DENSITY_MAP.normal;
  });
  root.style.setProperty('--grain-opacity', String(GRAIN_MAP[vals.grainIntensity] ?? 0.055));
  localStorage.setItem('resonance-tweaks', JSON.stringify(vals));
  window.parent.postMessage({ type: '__edit_mode_set_keys', edits: vals }, '*');
}

export function TweaksPanel() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<TweakState>(TWEAK_DEFAULTS);

  useEffect(() => {
    let saved: Partial<TweakState> = {};
    try {
      saved = JSON.parse(localStorage.getItem('resonance-tweaks') || '{}');
    } catch {
      saved = {};
    }
    const current: TweakState = { ...TWEAK_DEFAULTS, ...saved };
    setState(current);
    applyTweaks(current);

    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === '__activate_edit_mode') setOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMessage);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const update = (patch: Partial<TweakState>) => {
    const next = { ...state, ...patch };
    setState(next);
    applyTweaks(next);
  };

  if (!open) return null;

  return (
    <div id="tweaks-panel" className="open">
      <div className="tweaks-title">✦ Tweaks</div>

      <label className="tweak-label">Accent Color</label>
      <select
        className="tweak-select"
        value={state.accentColor}
        onChange={(e) => update({ accentColor: e.target.value })}
      >
        <option value="terracotta">Terracotta (default)</option>
        <option value="sage">Sage Green</option>
        <option value="lavender">Lavender</option>
        <option value="yellow">Golden Yellow</option>
      </select>

      <label className="tweak-label">Card Density</label>
      <select
        className="tweak-select"
        value={state.cardDensity}
        onChange={(e) => update({ cardDensity: e.target.value })}
      >
        <option value="normal">Normal (3-col)</option>
        <option value="compact">Compact (4-col)</option>
        <option value="airy">Airy (2-col)</option>
      </select>

      <label className="tweak-label">Grain Intensity</label>
      <input
        type="range"
        className="tweak-range"
        min={0}
        max={3}
        step={1}
        value={state.grainIntensity}
        onChange={(e) => update({ grainIntensity: +e.target.value })}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 11,
          color: 'var(--color-text-muted)',
          marginTop: 2,
        }}
      >
        <span>None</span>
        <span>Soft</span>
        <span>Medium</span>
        <span>Heavy</span>
      </div>
    </div>
  );
}
