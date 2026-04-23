// ── Resonance Design System · Atomic Components (v7) ─────────────────────────
// Single-pass hand-drawn border (fill + stroke share one path).
// Per-corner radius jitter (rounded but imperfectly sized).
// Each straight edge = 3 cubics with 2 interior wobble anchors → visibly non-straight.

// ── Seeded PRNG ───────────────────────────────────────────────────────────────
function makePrng(seed) {
  let s = (seed * 9301 + 49297) % 233280;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// ── wobRect (v8) ──────────────────────────────────────────────────────────────
// Corners: clean bezier quarter-circles, each with slightly jittered radius.
// Edges: configurable number of cubics (segments) via segmentsH / segmentsV.
//   segments = 1     → single direct cubic (no wobble, straight-ish edge)
//   segments = N > 1 → N cubics joined by (N-1) interior wobble anchors
// Pass a number for fixed count, or [min, max] tuple for seeded random pick.
// Tangents at every junction are exactly horizontal (top/bottom) or vertical
// (left/right), giving smooth G1 continuity with no kinks.
function wobRect(W, H, R, seed, mag, opts) {
  const rnd = makePrng(seed);
  const m = mag != null ? mag : Math.min(W, H) * 0.025;
  const K = 0.552; // bezier quarter-circle approximation constant

  // curve: multiplier on edge wobble amplitude (how "curvy" each edge looks).
  //        1 = default; <1 calmer (use on large surfaces like cards);
  //        >1 more pronounced (use on small elements like buttons/badges).
  // cornerJitter: multiplier on per-corner radius variation — bigger values
  //        make the four corners differ more, strengthening hand-drawn feel.
  // cornerOffset: pixel amount each corner's endpoint shifts along its edge,
  //        so opposite corners aren't perfectly aligned (avatar-style asymmetry).
  const curve        = (opts && opts.curve)        != null ? opts.curve        : 1;
  const cornerJitter = (opts && opts.cornerJitter) != null ? opts.cornerJitter : 1;
  const cornerOffset = (opts && opts.cornerOffset) != null ? opts.cornerOffset : 0;

  // Resolve segment count — number, or [lo, hi] picked via the seeded PRNG.
  const resolveSegs = (val, fallback) => {
    if (val == null) return fallback;
    if (Array.isArray(val)) {
      const [lo, hi] = val;
      return lo + Math.floor(rnd() * (hi - lo + 1));
    }
    return val | 0;
  };
  const segH = resolveSegs(opts && opts.segmentsH, 3);
  const segV = resolveSegs(opts && opts.segmentsV, 3);

  // Per-corner radius — same roundness, slightly different sizes per corner.
  // Clamped to 0 when R approaches min(W,H)/2 (pills stay perfect pills).
  const rVar = Math.min(R * 0.07, Math.max(0, Math.min(W, H) / 2 - R) * 0.4) * cornerJitter;
  const Rtl = R + (rnd() - 0.5) * 2 * rVar;
  const Rtr = R + (rnd() - 0.5) * 2 * rVar;
  const Rbr = R + (rnd() - 0.5) * 2 * rVar;
  const Rbl = R + (rnd() - 0.5) * 2 * rVar;

  // Per-corner endpoint offset — nudges where each corner meets its neighbor
  // edges, so top/bottom aren't perfect mirrors. Capped so pills stay stable.
  const oCap = Math.max(0, Math.min(W, H) * 0.5 - Math.max(Rtl, Rtr, Rbr, Rbl)) * 0.6;
  const oMag = Math.min(cornerOffset, oCap);
  const ox = () => (rnd() - 0.5) * 2 * oMag;
  const oy = () => (rnd() - 0.5) * 2 * oMag;
  const tlX = ox(), tlY = oy();
  const trX = ox(), trY = oy();
  const brX = ox(), brY = oy();
  const blX = ox(), blY = oy();

  // Edge wobble amplitude — scaled by `curve`. Clamp still prevents kinks on
  // tiny elements, but with curve>1 we allow a bigger cap so buttons/badges
  // can show real wobble despite being short.
  const perpAmp = Math.min(m * 0.95 * curve, Math.min(W, H) * 0.032 * Math.max(1, curve));

  const f = n => +n.toFixed(2);
  const C = (x1, y1, x2, y2, x, y) =>
    `C ${f(x1)},${f(y1)} ${f(x2)},${f(y2)} ${f(x)},${f(y)}`;

  // Cubic with HORIZONTAL tangent at both endpoints (top/bottom edges).
  const cubicH = (P0, P1) => {
    const h = Math.abs(P1[0] - P0[0]) / 3;
    const dir = P1[0] >= P0[0] ? 1 : -1;
    return C(P0[0] + dir * h, P0[1], P1[0] - dir * h, P1[1], P1[0], P1[1]);
  };
  // Cubic with VERTICAL tangent at both endpoints (left/right edges).
  const cubicV = (P0, P1) => {
    const h = Math.abs(P1[1] - P0[1]) / 3;
    const dir = P1[1] >= P0[1] ? 1 : -1;
    return C(P0[0], P0[1] + dir * h, P1[0], P1[1] - dir * h, P1[0], P1[1]);
  };

  // Build an edge as `segs` cubics with (segs-1) interior wobble anchors.
  // Short edges (e.g. pill left/right) or segs <= 1 fall back to a single cubic.
  const buildEdge = (P0, P1, axis, segs) => {
    const emit = axis === 'x' ? cubicH : cubicV;
    const len = axis === 'x' ? Math.abs(P1[0] - P0[0]) : Math.abs(P1[1] - P0[1]);
    if (segs < 2 || len < perpAmp * 4) return [emit(P0, P1)];
    const anchors = [];
    const anchorJitter = Math.min(0.08, 0.4 / segs);
    for (let i = 1; i < segs; i++) {
      const t = i / segs + (rnd() - 0.5) * anchorJitter;
      const x = P0[0] + (P1[0] - P0[0]) * t;
      const y = P0[1] + (P1[1] - P0[1]) * t;
      anchors.push(axis === 'x'
        ? [x, y + (rnd() - 0.5) * 2 * perpAmp]
        : [x + (rnd() - 0.5) * 2 * perpAmp, y]);
    }
    const result = [];
    let prev = P0;
    for (const a of anchors) { result.push(emit(prev, a)); prev = a; }
    result.push(emit(prev, P1));
    return result;
  };

  // Corner endpoint positions, with small per-corner offset applied.
  const TLa = [0,              Rtl + tlY];        // TL start (on left edge)
  const TLb = [Rtl + tlX,      0];                // TL end   (on top edge)
  const TRa = [W - Rtr + trX,  0];                // TR start (on top edge)
  const TRb = [W,              Rtr + trY];        // TR end   (on right edge)
  const BRa = [W,              H - Rbr + brY];    // BR start (on right edge)
  const BRb = [W - Rbr + brX,  H];                // BR end   (on bottom edge)
  const BLa = [Rbl + blX,      H];                // BL start (on bottom edge)
  const BLb = [0,              H - Rbl + blY];    // BL end   (on left edge)

  const parts = [`M ${f(TLa[0])},${f(TLa[1])}`];

  // TL corner: TLa → TLb
  parts.push(C(0, TLa[1] * (1 - K) + TLb[1] * K,
               TLb[0] * (1 - K) + TLa[0] * K, 0,
               TLb[0], TLb[1]));
  parts.push(...buildEdge(TLb, TRa, 'x', segH));

  // TR corner: TRa → TRb
  parts.push(C(TRa[0] + (W - TRa[0]) * K, 0,
               W, TRb[1] * (1 - K),
               TRb[0], TRb[1]));
  parts.push(...buildEdge(TRb, BRa, 'y', segV));

  // BR corner: BRa → BRb
  parts.push(C(W, BRa[1] + (H - BRa[1]) * K,
               BRb[0] + (W - BRb[0]) * K, H,
               BRb[0], BRb[1]));
  parts.push(...buildEdge(BRb, BLa, 'x', segH));

  // BL corner: BLa → BLb
  parts.push(C(BLa[0] * (1 - K), H,
               0, BLb[1] + (H - BLb[1]) * K,
               BLb[0], BLb[1]));
  parts.push(...buildEdge(BLb, TLa, 'y', segV));

  parts.push('Z');
  return parts.join(' ');
}

// ── useElementSize ────────────────────────────────────────────────────────────
function useElementSize(ref, defaultW = 160, defaultH = 48) {
  const [dims, setDims] = React.useState({ w: defaultW, h: defaultH });
  React.useLayoutEffect(() => {
    if (!ref.current) return;
    const update = () => {
      if (ref.current)
        setDims({ w: ref.current.offsetWidth, h: ref.current.offsetHeight });
    };
    const ro = new ResizeObserver(update);
    ro.observe(ref.current);
    update();
    return () => ro.disconnect();
  }, []);
  return dims;
}

// ── HandDrawnBorder ───────────────────────────────────────────────────────────
// Single SVG bezier path used for BOTH fill and stroke — no misalignment ever,
// no secondary pencil pass (kept the design clean, one confident line).
function HandDrawnBorder({ w, h, R = 22, seed = 1, mag, fillColor, strokeColor, strokeWidth = 2.5, chalkSeed, segmentsH, segmentsV, curve = 1, cornerJitter = 1, cornerOffset = 0 }) {
  if (!w || !h) return null;
  const m       = mag != null ? mag : Math.min(w, h) * 0.025;
  const segKey  = JSON.stringify([segmentsH, segmentsV, curve, cornerJitter, cornerOffset]);
  const path    = React.useMemo(
    () => wobRect(w, h, R, seed, m, { segmentsH, segmentsV, curve, cornerJitter, cornerOffset }),
    [w, h, R, seed, m, segKey]
  );
  const chalkId = chalkSeed != null ? `chalk-hdb-${chalkSeed}` : null;

  return (
    <svg
      aria-hidden="true"
      width={w} height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{
        position: 'absolute', top: 0, left: 0,
        overflow: 'visible', pointerEvents: 'none', zIndex: 0,
      }}
    >
      {chalkId && (
        <defs>
          <filter id={chalkId} x="0%" y="0%" width="100%" height="100%"
            colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise"
              baseFrequency={`${0.50 + (chalkSeed % 6) * 0.018} ${0.38 + (chalkSeed % 6) * 0.012}`}
              numOctaves="4" seed={chalkSeed + 30}/>
            <feColorMatrix type="matrix"
              values="0 0 0 0 0.99  0 0 0 0 0.94  0 0 0 0 0.88  0 0 0 0.09 0"
              result="warmNoise"/>
            <feBlend in="SourceGraphic" in2="warmNoise" mode="multiply"/>
          </filter>
        </defs>
      )}
      {fillColor && (
        <path d={path} fill={fillColor}
          filter={chalkId ? `url(#${chalkId})` : undefined}/>
      )}
      <path d={path} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round"/>
    </svg>
  );
}

// ── GrainOverlay ─────────────────────────────────────────────────────────────
// extendTop / extendBottom let the grain spill OUTSIDE the parent's rect so
// it covers SectionEdge regions above/below the section — avoids seam where a
// flat SVG wave meets a grained section body.
function GrainOverlay({ opacity = 0.06, extendTop = 0, extendBottom = 0 }) {
  const id = React.useId().replace(/:/g, '');
  return (
    <svg style={{
      position:'absolute', left:0, right:0,
      top: -extendTop, bottom: -extendBottom,
      width:'100%', height: `calc(100% + ${extendTop + extendBottom}px)`,
      pointerEvents:'none', opacity, zIndex:10,
    }} aria-hidden="true">
      <defs>
        <filter id={`grain-${id}`} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
          <feBlend in="SourceGraphic" mode="multiply"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" filter={`url(#grain-${id})`}/>
    </svg>
  );
}

// ── OrganiBlob ────────────────────────────────────────────────────────────────
const BLOB_PATHS = [
  "M54,-65.2C68.7,-54.3,78.2,-36.8,80.1,-18.8C82,-.9,76.2,17.6,66.5,32.5C56.8,47.4,43.2,58.8,27.3,65.8C11.4,72.8,-6.7,75.4,-23.1,70.2C-39.5,65,-54.2,52,-63.5,36C-72.8,20,-76.7,1,-73.5,-16.4C-70.3,-33.8,-60,-49.6,-46.4,-60.8C-32.8,-72,-16.4,-78.5,1.6,-80.5C19.6,-82.5,39.2,-76.1,54,-65.2Z",
  "M47.5,-60.8C60.2,-51.2,68.5,-35.5,72.1,-18.5C75.7,-1.5,74.7,16.8,67.2,31.8C59.7,46.8,45.8,58.5,29.8,65.8C13.8,73.1,-4.2,76,-21.2,71.4C-38.2,66.8,-54.2,54.7,-63.5,39C-72.8,23.3,-75.4,4,-71.3,-13.3C-67.2,-30.6,-56.4,-46,-42.5,-55.8C-28.6,-65.6,-11.5,-69.8,4,-74.4C19.5,-79,34.8,-70.4,47.5,-60.8Z",
  "M42.3,-55.1C54.9,-46.1,64.9,-32.4,69.3,-16.8C73.7,-1.2,72.5,16.4,65.1,30.5C57.7,44.6,44.1,55.2,29.2,62.4C14.3,69.6,-1.9,73.4,-17.2,69.8C-32.5,66.2,-46.9,55.2,-57.3,41C-67.7,26.8,-74.1,9.4,-73.2,-7.8C-72.3,-25,-64.1,-42,-51.5,-51C-38.9,-60,-22,-61,-5.8,-54.8C10.4,-48.6,29.7,-64.1,42.3,-55.1Z",
  "M38.2,-49.7C50.9,-40.5,63.5,-30.4,68.3,-17.1C73.1,-3.8,70.1,12.7,62.5,26.2C54.9,39.7,42.7,50.2,28.7,57.5C14.7,64.8,-1.1,68.9,-15.6,65.5C-30.1,62.1,-43.3,51.2,-53.8,37.5C-64.3,23.8,-72.1,7.3,-71.4,-8.8C-70.7,-24.9,-61.5,-40.6,-48.4,-49.9C-35.3,-59.2,-18.3,-62,-2.8,-58.7C12.7,-55.4,25.5,-58.9,38.2,-49.7Z",
  "M44.8,-58.3C56.3,-47.7,62.6,-31.8,66.2,-15.1C69.8,1.6,70.7,19.2,63.8,32.5C56.9,45.8,42.2,54.8,26.8,61.5C11.4,68.2,-4.7,72.6,-19.3,69.3C-33.9,66,-47,55,-57.5,41.1C-68,27.2,-75.9,10.4,-75.3,-6.7C-74.7,-23.8,-65.6,-41.2,-52.7,-51.8C-39.8,-62.4,-23.1,-66.2,-5.6,-60C11.9,-53.8,33.3,-68.9,44.8,-58.3Z",
];

function OrganiBlob({ variant=0, fill='oklch(88% 0.08 55)', size=200, style={}, opacity=1 }) {
  return (
    <svg viewBox="-90 -90 180 180" width={size} height={size}
      style={{ display:'block', opacity, ...style }} aria-hidden="true">
      <path d={BLOB_PATHS[variant % BLOB_PATHS.length]} fill={fill}/>
    </svg>
  );
}

// ── OrganicButton ─────────────────────────────────────────────────────────────
const BTN_VARIANTS = {
  primary:   { fill:'var(--color-terracotta)', text:'var(--color-cream)',       stroke:'oklch(40% 0.16 45)', stroke2:'oklch(30% 0.14 45)' },
  secondary: { fill:'var(--color-lavender)',   text:'var(--color-cream)',       stroke:'oklch(50% 0.10 290)', stroke2:'oklch(40% 0.09 290)' },
  ghost:     { fill:'transparent',            text:'var(--color-text)',        stroke:'oklch(44% 0.04 70)', stroke2:'oklch(34% 0.04 70)' },
  outline:   { fill:'transparent',            text:'var(--color-terracotta)', stroke:'oklch(52% 0.13 45)', stroke2:'oklch(40% 0.11 45)' },
  ctaLight:  { fill:'var(--color-cream)',      text:'var(--color-terracotta)', stroke:'oklch(80% 0.04 75)', stroke2:'oklch(70% 0.04 75)' },
  ctaGhost:  { fill:'transparent',            text:'var(--color-cream)',      stroke:'oklch(88% 0.02 75 / 0.65)', stroke2:'oklch(80% 0.02 75 / 0.38)' },
};

const BTN_SEEDS = { primary:3, secondary:201, ghost:401, outline:601, ctaLight:801, ctaGhost:1001 };

function OrganicButton({ children, variant = 'primary', onClick, style = {} }) {
  const [hovered, setHovered] = React.useState(false);
  const ref = React.useRef(null);
  const { w, h } = useElementSize(ref, 160, 50);
  const v    = BTN_VARIANTS[variant] || BTN_VARIANTS.primary;
  const seed = BTN_SEEDS[variant] || 3;
  const R    = h > 0 ? h / 2 : 25;
  // Buttons: moderate wobble; perpAmp clamp in wobRect keeps it readable.
  const mag  = Math.min(w, h) * 0.050;

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        padding: '14px 32px',
        // NO background, NO border, NO borderRadius — all from HandDrawnBorder SVG
        background: 'none', border: 'none', outline: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: '600',
        letterSpacing: '0.02em',
        color: style.color || v.text,
        transform: hovered ? 'scale(1.05) rotate(-0.5deg)' : 'scale(1)',
        transition: 'transform 220ms cubic-bezier(.34,1.56,.64,1)',
        opacity: hovered ? 0.88 : 1,
        ...style,
        // Ensure color from style prop survives
        color: style.color || v.text,
      }}
    >
      <HandDrawnBorder
        w={w} h={h} R={R} seed={seed} mag={mag}
        fillColor={style.fillColor || v.fill}
        strokeColor={v.stroke}
        segmentsH={[3, 4]} segmentsV={1}
        curve={1.9} cornerJitter={1.6} cornerOffset={Math.min(w, h) * 0.035}
      />
      <span style={{ position:'relative', zIndex:1 }}>{children}</span>
    </button>
  );
}

// ── HandDrawnAvatar ───────────────────────────────────────────────────────────
function HandDrawnAvatar({ initials='?', size=36, color='var(--color-terracotta-light)', seed=1 }) {
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      <HandDrawnBorder
        w={size} h={size} R={size * 0.4} seed={seed}
        mag={size * 0.022}
        fillColor={color}
        strokeColor="oklch(36% 0.06 60 / 0.55)"
        strokeWidth={1.5}
        segmentsH={1} segmentsV={1}
        curve={1.3} cornerJitter={3.2} cornerOffset={size * 0.06}
      />
      <span style={{
        position:'absolute', inset:0,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontFamily:'var(--font-body)', fontWeight:'700',
        fontSize: size * 0.35, color:'var(--color-text)',
        userSelect:'none',
      }}>{initials}</span>
    </div>
  );
}

// ── wavyLine (utility) ────────────────────────────────────────────────────────
// Returns SVG path data for a horizontal hand-drawn wavy line of total width W,
// centered on y=0. Use inside an SVG with a y-offset viewBox or translate.
function wavyLine(W, seed = 1, amp = 2, steps = 5) {
  const rnd = makePrng(seed);
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = t * W;
    const y = (i === 0 || i === steps) ? 0 : (rnd() - 0.5) * 2 * amp;
    pts.push([x, y]);
  }
  const f = n => +n.toFixed(2);
  let d = `M ${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const h = (x1 - x0) / 3;
    d += ` C ${f(x0 + h)},${f(y0)} ${f(x1 - h)},${f(y1)} ${f(x1)},${f(y1)}`;
  }
  return d;
}

// ── SectionEdge ───────────────────────────────────────────────────────────────
// Reusable wavy edge for section-to-section transitions (and anywhere else a
// hand-drawn horizontal boundary is wanted).
//
// Place as a child of the section that owns this edge. The component is
// absolutely positioned; pass position='top' or 'bottom'. It extends `height`
// pixels OUTSIDE the parent (overlapping the adjacent section) so the parent
// section's bg naturally covers content there with a wavy shape — this is how
// blobs bleeding past the section get clipped by the wave instead of by a
// straight line (requires the parent section to have overflow:visible).
//
// amplitude is a fraction of height — 0 is perfectly flat, 1 is as wavy as
// possible. For a "rough straight line with character" use 0.15–0.3.
function SectionEdge({
  fill,
  position = 'top',
  seed = 1,
  height = 48,
  amplitude = 0.25,
  steps = 14,
  bleed = 1,
  zIndex = 4,
  style = {},
}) {
  const W = 1440;
  const d = React.useMemo(() => {
    const rnd = makePrng(seed);
    const amp = height * amplitude;
    const baseY = height; // wavy line sits near the inner edge
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = t * W + (i > 0 && i < steps ? (rnd() - 0.5) * (W / steps) * 0.22 : 0);
      const y = (i === 0 || i === steps) ? baseY : baseY - (rnd() - 0.5) * 2 * amp;
      pts.push([x, y]);
    }
    const f = n => +n.toFixed(2);
    let out = `M ${f(pts[0][0])},${f(pts[0][1])}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      const midX = (x0 + x1) / 2;
      out += ` C ${f(midX)},${f(y0)} ${f(midX)},${f(y1)} ${f(x1)},${f(y1)}`;
    }
    // Close out the fill area below the wavy top edge.
    out += ` L ${W},${f(height + bleed)} L 0,${f(height + bleed)} Z`;
    return out;
  }, [seed, height, amplitude, steps, bleed]);

  const common = {
    position: 'absolute', left: 0, right: 0,
    height: height + bleed, pointerEvents: 'none',
    zIndex,
    ...style,
  };
  const posStyle = position === 'top'
    ? { top: -height }
    : { bottom: -height, transform: 'scaleY(-1)' };

  return (
    <div style={{ ...common, ...posStyle }} aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${height + bleed}`} preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: '100%' }}>
        <path d={d} fill={fill} />
      </svg>
    </div>
  );
}

// Back-compat shims so older call sites keep working.
function HandDrawnWave({ fill, seed = 1, height = 64, flip = false }) {
  return <SectionEdge fill={fill} seed={seed} height={height}
    position={flip ? 'bottom' : 'top'} amplitude={0.35} steps={10} />;
}
function WaveDivider({ fill = 'var(--color-cream)', flip = false, seed = 3 }) {
  return <HandDrawnWave fill={fill} seed={seed} flip={flip} />;
}

// ── TagPill (hand-drawn badge) ────────────────────────────────────────────────
function TagPill({ children, color='var(--color-yellow)', seed }) {
  const ref = React.useRef(null);
  const { w, h } = useElementSize(ref, 90, 22);
  // Stable per-instance seed if none provided (hashed from text content).
  const autoSeed = React.useMemo(() => {
    if (seed != null) return seed;
    const s = String(children);
    let hash = 7;
    for (let i = 0; i < s.length; i++) hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0;
    return Math.abs(hash) % 9973 + 1;
  }, [children, seed]);
  const R = h > 0 ? h * 0.5 : 11;

  return (
    <span ref={ref} style={{
      position:'relative', display:'inline-flex', alignItems:'center',
      padding:'4px 14px',
      fontSize:'11px', fontWeight:'600',
      fontFamily:'var(--font-body)', color:'var(--color-text)',
      letterSpacing:'0.04em', textTransform:'uppercase',
      lineHeight: 1.3,
    }}>
      <HandDrawnBorder
        w={w} h={h} R={R} seed={autoSeed}
        mag={Math.min(w, h) * 0.055}
        fillColor={color}
        strokeColor="oklch(32% 0.05 60 / 0.45)"
        strokeWidth={1.2}
        segmentsH={[3, 4]} segmentsV={1}
        curve={2.0} cornerJitter={1.8} cornerOffset={Math.min(w, h) * 0.04}
      />
      <span style={{ position:'relative', zIndex:1 }}>{children}</span>
    </span>
  );
}

Object.assign(window, {
  makePrng, wobRect, wavyLine, useElementSize,
  HandDrawnBorder, HandDrawnAvatar,
  GrainOverlay, OrganiBlob,
  OrganicButton, WaveDivider, HandDrawnWave, SectionEdge, TagPill,
  Avatar: (props) => React.createElement(HandDrawnAvatar, props),
});
