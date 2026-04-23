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
function useElementSize(ref, defaultW = 160, defaultH = 48, deps = []) {
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
  }, deps);
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
            <feBlend in="SourceGraphic" in2="warmNoise" mode="multiply" result="blended"/>
            {/* Clip result to SourceGraphic so feBlend's additive alpha
                (a+b-ab) can't leak warm noise past the path outline. */}
            <feComposite in="blended" in2="SourceGraphic" operator="in"/>
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

function OrganiBlob({ variant=0, fill='oklch(88% 0.08 55)', size=200, style={}, opacity=1, grain=0.4 }) {
  const id = React.useId().replace(/:/g, '');
  const d  = BLOB_PATHS[variant % BLOB_PATHS.length];
  return (
    <svg viewBox="-90 -90 180 180" width={size} height={size}
      style={{ display:'block', opacity, ...style }} aria-hidden="true">
      {grain > 0 && (
        <defs>
          <filter id={`blob-grain-${id}`} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"
              stitchTiles="stitch" seed={variant + 1}/>
            <feColorMatrix type="saturate" values="0"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope={grain}/>
            </feComponentTransfer>
            <feComposite in2="SourceGraphic" operator="in"/>
          </filter>
        </defs>
      )}
      <path d={d} fill={fill}/>
      {grain > 0 && <path d={d} fill="black" filter={`url(#blob-grain-${id})`}/>}
    </svg>
  );
}

// ── ShapeGrain ────────────────────────────────────────────────────────────────
// Paper-grain overlay clipped to an arbitrary SVG path (e.g. a wobRect border).
// Drops a second path filled with fractalNoise, kept inside the shape by
// feComposite operator="in". Use on top of a HandDrawnBorder fill layer.
function ShapeGrain({ w, h, d, opacity = 0.2, frequency = 0.9, seed = 1, zIndex = 0 }) {
  const id = React.useId().replace(/:/g, '');
  if (!w || !h || !d) return null;
  return (
    <svg aria-hidden="true" width={w} height={h} viewBox={`0 0 ${w} ${h}`}
      style={{ position:'absolute', top:0, left:0, pointerEvents:'none', zIndex, overflow:'visible' }}>
      <defs>
        <filter id={`sg-${id}`} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency={frequency} numOctaves="2"
            stitchTiles="stitch" seed={seed}/>
          <feColorMatrix type="saturate" values="0"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope={opacity}/>
          </feComponentTransfer>
          <feComposite in2="SourceGraphic" operator="in"/>
        </filter>
        {/* Hard clip so the grain cannot leak past the shape outline even
            when the filter region rounds outward by a fraction of a pixel. */}
        <clipPath id={`sgc-${id}`}><path d={d}/></clipPath>
      </defs>
      <g clipPath={`url(#sgc-${id})`}>
        <path d={d} fill="black" filter={`url(#sg-${id})`}/>
      </g>
    </svg>
  );
}

// ── useIsMobile ───────────────────────────────────────────────────────────────
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    if (mq.addEventListener) mq.addEventListener('change', update);
    else mq.addListener(update);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', update);
      else mq.removeListener(update);
    };
  }, [breakpoint]);
  return isMobile;
}

// ── OrganicButton ─────────────────────────────────────────────────────────────
const BTN_VARIANTS = {
  primary:   { fill:'var(--color-terracotta)', text:'var(--color-cream)',       stroke:'oklch(40% 0.16 45)', stroke2:'oklch(30% 0.14 45)', hoverOverlay:'oklch(0% 0 0 / 0.14)' },
  secondary: { fill:'var(--color-lavender)',   text:'var(--color-cream)',       stroke:'oklch(50% 0.10 290)', stroke2:'oklch(40% 0.09 290)', hoverOverlay:'oklch(0% 0 0 / 0.12)' },
  ghost:     { fill:'transparent',            text:'var(--color-text)',        stroke:'oklch(44% 0.04 70)', stroke2:'oklch(34% 0.04 70)', hoverOverlay:'oklch(60% 0.10 45 / 0.14)' },
  outline:   { fill:'transparent',            text:'var(--color-terracotta)', stroke:'oklch(52% 0.13 45)', stroke2:'oklch(40% 0.11 45)', hoverOverlay:'oklch(62% 0.14 45 / 0.14)' },
  ctaLight:  { fill:'var(--color-cream)',      text:'var(--color-terracotta)', stroke:'oklch(80% 0.04 75)', stroke2:'oklch(70% 0.04 75)', hoverOverlay:'oklch(0% 0 0 / 0.08)' },
  ctaGhost:  { fill:'transparent',            text:'var(--color-cream)',      stroke:'oklch(88% 0.02 75 / 0.65)', stroke2:'oklch(80% 0.02 75 / 0.38)', hoverOverlay:'oklch(96% 0.015 75 / 0.18)' },
};

const BTN_SEEDS = { primary:3, secondary:201, ghost:401, outline:601, ctaLight:801, ctaGhost:1001 };

function OrganicButton({ children, variant = 'primary', onClick, style = {} }) {
  const [hovered, setHovered] = React.useState(false);
  const [pos, setPos]         = React.useState({ x: 0, y: 0 });
  const ref = React.useRef(null);
  const { w, h } = useElementSize(ref, 160, 50);
  const v    = BTN_VARIANTS[variant] || BTN_VARIANTS.primary;
  const seed = BTN_SEEDS[variant] || 3;
  const R    = h > 0 ? h / 2 : 25;
  // Buttons: moderate wobble; perpAmp clamp in wobRect keeps it readable.
  const mag  = Math.min(w, h) * 0.050;
  const maskId = React.useId().replace(/:/g, '');

  const recordPointer = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };
  const maxR = Math.hypot(
    Math.max(pos.x, w - pos.x),
    Math.max(pos.y, h - pos.y)
  ) + 4;

  const cornerOff = Math.min(w, h) * 0.035;
  const overlayPath = React.useMemo(() => {
    if (!w || !h) return '';
    return wobRect(w, h, R, seed, mag,
      { segmentsH: [3, 4], segmentsV: 1, curve: 1.9, cornerJitter: 1.6, cornerOffset: cornerOff });
  }, [w, h, R, seed, mag, cornerOff]);

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseEnter={(e) => { recordPointer(e); setHovered(true); }}
      onMouseLeave={(e) => { recordPointer(e); setHovered(false); }}
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
        ...style,
        color: style.color || v.text,
      }}
    >
      {/* Layer 1 — fill only. Stroke is drawn on top so grain + hover paint
          can't tint the outline. */}
      <HandDrawnBorder
        w={w} h={h} R={R} seed={seed} mag={mag}
        fillColor={style.fillColor || v.fill}
        strokeColor="transparent"
        strokeWidth={0}
        segmentsH={[3, 4]} segmentsV={1}
        curve={1.9} cornerJitter={1.6} cornerOffset={Math.min(w, h) * 0.035}
      />
      {/* Layer 2 — paper-grain clipped to the button shape.
          Skipped on transparent-fill variants where grain would show over
          whatever sits behind the button. */}
      {v.fill !== 'transparent' && (
        <ShapeGrain w={w} h={h} d={overlayPath} opacity={0.38} frequency={1.1} seed={seed}/>
      )}
      {/* Layer 3 — hover overlay (paint spreads from pointer entry). */}
      {w > 0 && h > 0 && (
        <svg aria-hidden="true" width={w} height={h} viewBox={`0 0 ${w} ${h}`}
          style={{ position:'absolute', top:0, left:0, overflow:'visible', pointerEvents:'none', zIndex:0 }}>
          <defs>
            <mask id={`btn-${maskId}`} maskUnits="userSpaceOnUse"
              x={-w} y={-h} width={w * 3} height={h * 3}>
              <circle cx={pos.x} cy={pos.y} r={hovered ? maxR : 0} fill="white"
                style={{ transition: 'r 340ms linear' }} />
            </mask>
          </defs>
          <g mask={`url(#btn-${maskId})`}>
            <path d={overlayPath} fill={v.hoverOverlay || 'oklch(0% 0 0 / 0.12)'} />
          </g>
        </svg>
      )}
      {/* Layer 4 — stroke-only border on top. Same seed/params → identical
          path geometry, so the line sits exactly on the fill's edge but is
          never covered by grain or the hover wash. */}
      <HandDrawnBorder
        w={w} h={h} R={R} seed={seed} mag={mag}
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

// ── wavyPath (utility) ────────────────────────────────────────────────────────
// Returns a seeded hand-drawn wavy polyline across width W, starting at (0, y0)
// and ending at (W, y0). Amplitude `amp` deflects control points up/down.
// Returns an array of [x, y] points; caller turns them into a bezier path.
function wavyPoints(W, y0, amp, seed, steps) {
  const rnd = makePrng(seed);
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Slight x-jitter keeps peaks from landing on a regular grid.
    const x = t * W + (i > 0 && i < steps ? (rnd() - 0.5) * (W / steps) * 0.18 : 0);
    const y = (i === 0 || i === steps) ? y0 : y0 - (rnd() - 0.5) * 2 * amp;
    pts.push([x, y]);
  }
  return pts;
}

function pointsToBezier(pts) {
  const f = n => +n.toFixed(2);
  let out = `M ${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const midX = (x0 + x1) / 2;
    out += ` C ${f(midX)},${f(y0)} ${f(midX)},${f(y1)} ${f(x1)},${f(y1)}`;
  }
  return out;
}

// ── SectionEdge (v2 — "mask from above") ─────────────────────────────────────
// Sits at the TOP of a section. Fills the region ABOVE a seeded wavy line
// with `topColor` (the previous section's color). Region BELOW the wave is
// transparent so the host section's own background shows through.
//
// The wavy line itself becomes the hand-drawn boundary between the two
// sections. Because the edge is INSIDE the lower section (not overflowing
// into the upper one), the wave never gets clipped.
//
// The host section MUST reserve `height` pixels of space above its content
// (padding-top or a wrapper margin) so the wave area reads as empty room.
//
// amplitude is a fraction of height — keep small (0.12–0.2) for a calm,
// hand-drawn straight-ish line rather than a rolling wave.
function SectionEdge({
  topColor,
  seed = 1,
  height = 80,
  amplitude = 0.15,
  steps = 14,
  zIndex = 1,
  style = {},
  stroke,
  strokeWidth = 1.2,
}) {
  const W = 1440;
  // On narrow viewports the SVG is scaled by preserveAspectRatio="none",
  // so 14 steps authored for 1440px collapse into a busy, jittery line on a
  // 375px screen. Use fewer segments — and a different seed — so the mobile
  // edge reads as its own, naturally calmer hand-drawn curve rather than a
  // squashed desktop one.
  const isMobile = useIsMobile(640);
  const effSteps = isMobile ? Math.max(4, Math.round(steps * 0.45)) : steps;
  const effSeed  = isMobile ? seed + 9173 : seed;
  const { fillD, strokeD } = React.useMemo(() => {
    const amp = height * amplitude;
    // baseY sits near the bottom of the reserved band so most of the room
    // above the wave is occupied by `topColor`.
    const baseY = height * 0.78;
    const pts = wavyPoints(W, baseY, amp, effSeed, effSteps);
    const strokeD = pointsToBezier(pts);
    // Build the fill: start top-left, across top, down to wave end, wavy back.
    const f = n => +n.toFixed(2);
    const last = pts[pts.length - 1];
    let fillD = `M 0,-1 L ${W},-1 L ${f(last[0])},${f(last[1])}`;
    for (let i = pts.length - 2; i >= 0; i--) {
      const [x0, y0] = pts[i + 1];
      const [x1, y1] = pts[i];
      const midX = (x0 + x1) / 2;
      fillD += ` C ${f(midX)},${f(y0)} ${f(midX)},${f(y1)} ${f(x1)},${f(y1)}`;
    }
    fillD += ' Z';
    return { fillD, strokeD };
  }, [effSeed, height, amplitude, effSteps]);

  return (
    <div aria-hidden="true" style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      height, pointerEvents: 'none', zIndex, ...style,
    }}>
      <svg viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: '100%', overflow: 'visible' }}>
        <path d={fillD} fill={topColor} />
        {stroke && (
          <path d={strokeD} fill="none" stroke={stroke}
            strokeWidth={strokeWidth} strokeLinecap="round"
            vectorEffect="non-scaling-stroke" />
        )}
      </svg>
    </div>
  );
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

// ── HamburgerIcon ─────────────────────────────────────────────────────────────
// Mirrors /assets/icons/hamburger.svg — three gently-wobbling horizontal
// strokes. Kept inline so the Babel-standalone setup doesn't need to fetch.
function HamburgerIcon({ size = 22, color = 'currentColor', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.4,6.6 C6.8,6.1 12.1,7.4 16.3,6.5 C18.7,6.0 20.2,6.9 20.7,6.8"/>
      <path d="M3.1,12.1 C6.6,11.6 11.8,12.8 16.6,11.9 C19.1,11.4 20.3,12.2 20.9,12.0"/>
      <path d="M3.5,17.5 C7.1,17.0 11.9,18.2 16.1,17.2 C18.7,16.7 20.1,17.6 20.6,17.4"/>
    </svg>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
// Reusable hand-drawn dialog. Shape + grain match StoryCard so modals read as
// part of the same paper-on-desk world. Portaled into <body>, closes on ESC
// or backdrop click, locks page scroll while open.
function Modal({
  open, onClose, children,
  maxWidth = 440,
  seed = 17,
  fillColor = 'var(--color-card-bg)',
  borderColor = 'oklch(40% 0.06 60)',
  padding = '32px 28px',
  ariaLabel = 'Dialog',
}) {
  const ref = React.useRef(null);
  // Start with 0×0 so the hand-drawn layers stay unrendered until the
  // container has been measured. Prevents a flash at the default maxWidth
  // (which overflows narrow phones) and stale height that cuts off content.
  // Pass `open` as a dep so the ResizeObserver re-attaches when the modal
  // mounts its content (ref.current is null on the initial closed render).
  const { w, h } = useElementSize(ref, 0, 0, [open]);
  const R = 26;

  React.useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') onClose && onClose(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const borderPath = (w && h)
    ? wobRect(w, h, R, seed, Math.min(w, h) * 0.025,
        { segmentsH: [3, 4], segmentsV: [5, 6], curve: 0.6, cornerJitter: 0.9, cornerOffset: 5 })
    : '';

  return ReactDOM.createPortal(
    <div
      role="dialog" aria-modal="true" aria-label={ariaLabel}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(12px, 3vw, 32px)',
        background: 'oklch(20% 0.04 60 / 0.42)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        animation: 'resModalFadeIn 220ms ease',
        overflowY: 'auto',
      }}
    >
      <div
        ref={ref}
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth,
          minWidth: 0,
          boxSizing: 'border-box',
          padding,
          animation: 'resModalPopIn 280ms cubic-bezier(.2,.9,.3,1.05)',
        }}
      >
        {/* Fill + chalk texture (no stroke) */}
        <HandDrawnBorder
          w={w} h={h} R={R} seed={seed}
          fillColor={fillColor}
          strokeColor="transparent"
          strokeWidth={0}
          chalkSeed={seed + 1}
          segmentsH={[3, 4]} segmentsV={[5, 6]}
          curve={0.6} cornerJitter={0.9} cornerOffset={5}
        />
        {/* Paper grain clipped to shape */}
        <ShapeGrain w={w} h={h} d={borderPath}
          opacity={0.3} frequency={0.88} seed={seed}/>
        {/* Stroke-only border on top so grain can't cover the outline */}
        <HandDrawnBorder
          w={w} h={h} R={R} seed={seed}
          strokeColor={borderColor}
          strokeWidth={1.8}
          segmentsH={[3, 4]} segmentsV={[5, 6]}
          curve={0.6} cornerJitter={0.9} cornerOffset={5}
        />
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: 22, right: 18,
            width: 34, height: 34, border: 'none', background: 'none',
            cursor: 'pointer', color: 'var(--color-text)', opacity: 0.55,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 3, transition: 'opacity 150ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = 1)}
          onMouseLeave={e => (e.currentTarget.style.opacity = 0.55)}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
            stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <path d="M4,4.2 C7,6.4 11.8,7.2 13.8,13.9"/>
            <path d="M13.9,4.1 C11.6,7 7.1,10.2 4.1,13.8"/>
          </svg>
        </button>
        <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
      </div>
    </div>,
    document.body
  );
}

// ── ResonanceIcon ─────────────────────────────────────────────────────────────
// Renders the brand SVG icon with its green (#6F8F72) paths dynamically filled
// using the current --color-terracotta CSS custom property.
// JavaScript reads the resolved color on every render and whenever the :root
// style attribute changes (e.g. when the Tweaks panel switches accent color).
function useAccentColor() {
  const [color, setColor] = React.useState(() =>
    getComputedStyle(document.documentElement)
      .getPropertyValue('--color-terracotta').trim() || '#6F8F72'
  );
  React.useEffect(() => {
    const read = () => {
      const val = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-terracotta').trim();
      if (val) setColor(val);
    };
    // Watch for inline style changes on :root (Tweaks panel writes them there)
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
    return () => mo.disconnect();
  }, []);
  return color;
}

function ResonanceIcon({ size = 32, style = {} }) {
  const accent = useAccentColor();
  // Inner beige rings stay #FAF3E9; outer green rings take the accent color.
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size} height={size}
      viewBox="248 238 1560 1572"
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0, ...style }}
    >
      <path fill={accent} d="M1005.45 283.5C1059.68 278.266 1117.26 295.129 1162.52 324.619C1186.29 340.112 1204.99 354.434 1232.82 363.238C1258.54 371.373 1282.23 370.921 1308.76 371.17C1364.68 371.317 1415.89 389.794 1458.88 424.638C1508.59 464.931 1524.95 515.078 1557.16 566.458C1568.25 584.142 1605.59 610.939 1622.93 625.155C1679.87 671.814 1716.21 739.09 1715.38 813.683C1715.14 837.549 1710.08 862.296 1716.03 885.78C1719.76 899.503 1726.88 914.54 1733.72 926.87C1766.04 985.14 1767.31 1053.95 1736.07 1113.02C1729.37 1125.67 1720.57 1143.07 1716.54 1156.89C1709.66 1180.49 1714.88 1207.58 1715.51 1232.03C1715.99 1251.85 1713.67 1271.64 1708.63 1290.81C1693.97 1347.41 1658.52 1393 1613.45 1428.78C1596.87 1441.95 1574.54 1459.62 1562.08 1476.05C1550.13 1491.79 1540.08 1514.8 1530.84 1532.89C1521.04 1551.93 1509.23 1569.87 1495.62 1586.41C1449.81 1641.58 1384.65 1672.09 1313.71 1675.05C1283.34 1676.32 1260.08 1674.51 1230.56 1685.77C1209.03 1693.99 1190.65 1704.59 1171.42 1717.13C1130.49 1743.84 1094.84 1761.07 1045.35 1765.5C980.472 1770.45 934.085 1752.99 880.399 1718.32C859.432 1704.77 840.232 1692.47 816.346 1684.46C791.55 1675.81 762.893 1675.49 736.998 1674.99C635.576 1673.06 556.004 1612.03 515.077 1521.45C509.31 1508.69 499.927 1490.14 491.471 1478.94C475.474 1457.74 450.995 1441.88 430.697 1425.03C371.993 1377.02 333.881 1313.13 335.948 1235.73C336.583 1211.93 340.637 1184.21 335.307 1161.32C331.93 1146.82 322.982 1129.21 316.087 1115.96C303.44 1091.66 294.715 1069 291.829 1041.51C287.698 1002.16 296.07 967.853 314.056 932.86C321.246 918.873 329.848 903.716 334.319 888.705C341.757 863.729 336.3 837.745 335.654 812.23C335.109 791.375 337.655 770.553 343.21 750.444C358.304 695.43 393.907 649.497 438.898 615.421C454.028 602.83 478.842 587.76 489.364 571.224C514.223 532.155 529.116 491.508 559.507 455.262C603.885 402.334 665.076 372.242 734.424 371.188C763.396 370.748 793.049 372.401 820.55 362.257C844.605 353.569 863.535 340.541 884.77 326.774C923.027 301.972 960.056 287.894 1005.45 283.5Z"/>
      <path fill="#FAF3E9" d="M1009.51 335.376C1022.64 333.613 1038.24 335.295 1051.18 336.771C1116.67 344.237 1155.25 390.27 1213.49 411.462C1240.39 421.253 1269.55 421.756 1298.01 422.355C1342.75 422.645 1380.41 434.521 1417.22 458.879C1473.71 496.26 1486.08 557.84 1523.91 608.878C1532.55 620.533 1552.51 635.559 1564.86 644.532C1599.52 669.704 1630.25 699.997 1647.46 739.982C1662.43 774.1 1664.44 805.666 1662.31 842.288C1661.47 856.811 1661.02 878.176 1664.48 891.974C1673.73 928.895 1697.94 958.599 1704.68 996.982C1711.39 1035.22 1703.67 1067.02 1685.65 1100.93C1679.21 1113.03 1670.34 1129.51 1666.6 1142.24C1652.57 1190.01 1671.24 1231.12 1656.37 1280.53C1640.15 1334.4 1608.76 1367.13 1565.52 1400.91C1552.38 1411.17 1532.63 1426.58 1523.21 1439.49C1500.61 1470.45 1488.78 1506.72 1466.67 1538.45C1431.66 1588.69 1374.65 1619.28 1313.87 1623.42C1276.75 1625.94 1248.11 1623.61 1211.79 1637.03C1176.75 1649.97 1154.45 1668.59 1122.97 1686.87C1097.88 1701.44 1072.47 1707.94 1044.2 1712.94C948.211 1724.61 907.877 1660.77 825.42 1633.19C807.092 1627.05 781.248 1624.83 761.8 1624.52C707.921 1623.64 666.639 1613.76 623.335 1580.26C577.31 1544.65 565.446 1495.47 534.31 1449.74C521.788 1431.35 501.265 1414.97 483.822 1400.78C437.886 1363.43 403.136 1326.21 390.568 1266.16C382.029 1225.35 393.729 1191.84 386.489 1152.31C382.898 1132.71 367.639 1107.61 358.996 1089.07C351.444 1072.96 346.578 1055.73 344.591 1038.05C337.57 975.715 367.897 951.466 385.007 897.912C397.111 860.03 381.422 809.207 394.037 766.19C406.447 723.874 431.824 686.307 466.47 658.881C493.12 637.783 510.171 629.143 532.07 600.626C558.75 565.884 567.54 530.349 594.981 496.529C616.113 470.242 643.353 449.521 674.326 436.171C726.603 414.066 783.2 429.394 828.111 413.827C899.832 388.969 925.461 344.485 1009.51 335.376Z"/>
      <path fill={accent} d="M1013.96 386.409C1048.06 384.23 1095.91 395.498 1124.43 413.956C1152.29 431.981 1170.51 447.108 1203.95 457.745C1237.3 468.354 1259.92 466.271 1293.29 467.232C1331.67 468.337 1377.31 487.185 1406.66 511.894C1444.05 543.379 1454.68 593.979 1484.12 631.649C1500.72 652.894 1520.5 665.926 1541.51 682.107C1589.08 718.746 1615.82 769.632 1614.38 830.111C1613.91 849.663 1611.18 883.94 1616.4 901.657C1628.28 941.979 1649.02 962.791 1654.33 1006.99C1661.5 1066.8 1633.34 1091.4 1616.66 1142.59C1605.88 1175.66 1621.65 1224.14 1610.13 1262.47C1594.66 1313.96 1570.53 1342.57 1527.79 1374.21C1511.45 1386.31 1494.41 1400.55 1482.63 1416.83C1460.52 1447.34 1451.29 1484.55 1427.46 1514.04C1395.41 1553.69 1346.73 1577.74 1295.84 1579.21C1264.02 1580.12 1231.39 1578.94 1201.16 1590.59C1129.27 1618.31 1118.21 1653.61 1036.42 1662.51C985.898 1665.02 948.604 1648.65 906.653 1622.22C884.352 1608.17 866.991 1596.7 841.536 1588.59C810.828 1578.81 786.033 1580.2 754.921 1579.76C714.767 1579.2 673.021 1560.35 642.799 1534.48C604.648 1501.82 594.465 1450.43 564.262 1411.77C546.771 1389.38 524.015 1376.76 502.767 1359.03C457.64 1321.39 432.106 1272.2 436.304 1212.79C437.516 1195.63 439.775 1160.52 435.315 1145.18C422.856 1102.32 400.015 1078.11 396.394 1030.95C392.211 976.465 419.461 950.507 434.515 902.43C444.468 870.641 429.753 822.48 438.913 789.252C452.284 740.751 477.085 704.14 517.858 674.766C536.469 661.358 555.722 646.114 569.322 627.686C593.957 594.308 601.737 558.51 629.556 526.398C663.882 486.775 709.034 468.244 760.996 466.653C792.366 465.693 819.878 467.537 850.024 456.792C873.668 448.363 889.198 438.027 909.569 424.076C943.69 400.709 972.778 389.865 1013.96 386.409Z"/>
      <path fill="#FAF3E9" d="M1015.35 437.35C1104.04 434.351 1119.84 485.829 1191.17 507.235C1208.29 512.267 1225.91 515.368 1243.71 516.479C1289.08 519.448 1320.92 513.864 1360.65 541.454C1405.71 572.743 1409.2 614.037 1437.71 654.349C1480.34 714.652 1545.95 720.858 1561.01 805.782C1567.53 842.548 1556.38 873.613 1563 907.783C1569.75 942.699 1593.93 967.27 1600.22 1004.92C1609.39 1059.81 1580.04 1083.93 1565.21 1130.17C1553.61 1166.35 1569.87 1209.2 1559.35 1250.45C1541.24 1321.45 1483.08 1332.87 1442.43 1385.57C1421.65 1412.52 1412.17 1445.72 1392.65 1472.83C1377.75 1493.41 1357.34 1509.35 1333.77 1518.84C1302.08 1531.76 1278.3 1527.82 1245.88 1529.64C1229.21 1530.48 1212.7 1533.35 1196.73 1538.19C1149.37 1552.81 1119.77 1581.52 1076.33 1601.81C1064.56 1607.31 1048.52 1609.94 1035.6 1612.05C953.288 1613.76 923.555 1560.32 848.781 1537.61C789.138 1519.49 739.493 1543.05 686.36 1502.4C644.679 1470.51 642.319 1434.96 612.443 1392.66C569.03 1331.18 504.033 1322.34 488.116 1240.64C481.204 1205.17 493.625 1172.67 486.726 1141.04C478.428 1102.99 454.309 1079.06 448.783 1037.37C441.358 981.359 469.624 961.931 484.63 914.804C496.115 878.735 479.317 839.344 489.847 796.905C508.439 721.97 567.793 711.875 610.373 656.203C631.918 628.034 641.632 594.45 663.327 566.503C678.186 547.362 696.43 534.886 718.843 526.012C747.46 514.682 774.715 517.843 804.459 516.538C822.181 515.903 839.756 513.08 856.784 508.132C904.14 494.192 923.638 468.627 965.79 449.178C980.875 442.218 998.937 439.366 1015.35 437.35Z"/>
      <path fill={accent} d="M1021.56 559.445C1059.43 557.361 1112.74 575.893 1142.43 597.263C1181.1 625.106 1195 631.167 1242.5 636.066C1281.46 640.082 1330.64 664.31 1360.01 691.397C1397.72 726.297 1420.77 774.216 1424.5 825.463C1425.87 846.296 1424.37 866.51 1431.31 886.47C1436.58 901.605 1444.44 914.519 1452.75 928.083C1469.41 955.266 1478.11 983.526 1479.2 1015.5C1480.47 1046.3 1473.53 1076.89 1459.09 1104.13C1446.15 1128.38 1430.65 1152.98 1427.11 1180.84C1425.41 1194.25 1425.4 1207.79 1424.61 1221.27C1421.46 1267.64 1402.13 1311.43 1369.98 1344.99C1337.56 1379.23 1294.05 1402.21 1247.47 1410.29C1227.92 1413.68 1206.7 1414.51 1188.08 1421.95C1173.09 1427.95 1159.01 1438.62 1145.55 1447.61C1107.29 1473.17 1071.87 1486.15 1025.92 1487.39C977.652 1486.4 946.53 1475.74 906.214 1448.6C891.789 1438.89 873.188 1427.16 857.31 1420.91C842.353 1415.63 824.8 1412.72 809.056 1410.53C714.134 1397.37 632.801 1318.75 626.391 1221.47C625 1200.36 627.169 1180.56 619.668 1159.91C612.84 1141.11 603.645 1127.73 593.307 1110.91C578.566 1087.08 570.088 1059.91 568.66 1031.93C566.632 997.045 577.026 957.168 596.446 928.354C622.622 889.517 623.961 872.009 626.411 827.297C628.6 782.744 646.002 740.29 675.714 707.019C704.838 674.495 752.946 645.535 796.148 637.43C820.642 632.834 841.358 632.408 865.809 622.177C886.743 613.418 898.991 603.278 917.476 591.35C947.84 571.758 985.716 561.404 1021.56 559.445Z"/>
      <path fill="#FAF3E9" d="M1010.89 612.376C1049.05 608.875 1086.6 621.19 1118.83 640.995C1139.76 653.861 1156.08 665.865 1179.73 674.27C1200.29 681.574 1214.35 681.987 1234.99 684.972C1262.21 688.925 1288.12 699.253 1310.59 715.115C1347.13 741.19 1371.92 785.238 1374.79 830.073C1376.3 853.742 1374.02 873.889 1382.42 896.859C1397.34 937.679 1421.82 958.062 1428.98 1002.71C1439.56 1068.8 1399.06 1099.73 1380.53 1157.15C1375.52 1173.56 1375.07 1192.26 1374.77 1209.21C1373.34 1290.59 1310.21 1350.55 1232.2 1362.82C1213.76 1365.72 1190.57 1367.54 1173.5 1375.42C1125.35 1397.66 1097.88 1427.17 1043.2 1435.78C969.037 1443.85 936.109 1405.4 874.866 1375.75C862.844 1369.93 836.768 1365.07 822.893 1363.37C744.122 1353.75 678.083 1291.35 675.244 1210.19C674.486 1188.46 676.045 1168.06 668.218 1147C654.751 1110.77 626.8 1080.67 622.291 1041.2C618.656 1012.71 624.433 980.233 638.098 954.986C650.178 932.667 661.972 916.847 669.482 891.563C676.27 868.706 675.5 854.123 676.639 831.496C678.04 803.649 694.152 768.022 710.798 745.882C735.348 713.23 776.822 691.233 816.498 683.708C840.803 679.099 859.893 679.779 884.266 668.886C899.939 661.882 908.895 656.115 923.183 646.644C952.128 627.457 976.316 616.726 1010.89 612.376Z"/>
      <path fill={accent} d="M1020.85 661.381C1048.44 659.392 1080.76 671.926 1103.58 686.641C1122.27 698.688 1139.9 712.232 1160.96 720.028C1174.54 725.053 1187.22 725.628 1201.38 726.897C1230.45 729.504 1255.76 736.7 1278.89 754.66C1311.74 780.168 1327.35 814.528 1328.27 855.68C1328.66 872.768 1330.17 895.553 1336.01 911.634C1349.48 948.72 1372.3 969.122 1377.27 1009.97C1384.21 1067.04 1350.2 1092.62 1334.19 1142.25C1330.11 1154.9 1329.38 1173.6 1329.1 1187.14C1328.46 1217.79 1319.57 1247.81 1300.42 1272.23C1279.38 1299.07 1242.8 1315.4 1209.47 1319.66C1191.16 1322 1173.98 1321.87 1156.56 1329.25C1143.27 1334.89 1130.12 1342.91 1118.37 1351.28C1086.5 1373.96 1068.64 1382.18 1030.25 1386.56C987.915 1384.88 966.846 1374.58 931.853 1351.19C920.108 1344.14 903.974 1333.1 890.921 1329.35C847.309 1316.85 806.75 1321.87 768.619 1290.87C737.061 1265.22 722.226 1231.52 722.307 1190.65C722.34 1173.87 721.031 1153.38 715.612 1137.37C701.348 1097.91 677.205 1078.4 672.343 1034.59C665.943 976.911 700.282 950.712 716.582 900.079C720.883 885.507 722.109 867.989 722.388 852.882C723.678 783.142 773.271 735.526 841.004 727.038C855.812 725.182 878.002 724.555 891.867 718.199C941.336 695.522 963.414 666.89 1020.85 661.381Z"/>
      <path fill="#FAF3E9" d="M1012.68 713.357C1071.39 707.248 1092.34 748.582 1143.19 766.241C1175.56 777.479 1210.41 768.798 1239.53 788.404C1294.46 825.382 1267.79 871.118 1284.6 920.583C1294.5 949.753 1319.52 973.211 1326.5 1005.84C1338.27 1060.93 1293.63 1085.68 1282.17 1135.65C1273.68 1172.76 1284.56 1200.86 1262.87 1234.98C1231.53 1284.29 1185.48 1264.61 1141.54 1281.2C1101.13 1296.46 1084.36 1324.47 1037.24 1334.57C977.566 1338.06 954.84 1300.29 903.462 1281.97C871.19 1270.46 839.482 1279.34 809.608 1259.47C754.078 1222.55 779.414 1173.72 761.78 1121.52C752.03 1092.66 730.913 1072.55 724.306 1041.04C721.461 1027.78 721.654 1014.04 724.869 1000.87C732.03 972.296 753.961 949.011 763.179 919.265C774.703 882.076 762.463 846.516 784.434 813.433C793.24 800.076 805.523 789.373 819.96 782.478C850.126 768.378 881.249 777.109 908.102 766.124C950.064 748.96 964.936 722.982 1012.68 713.357Z"/>
    </svg>
  );
}

Object.assign(window, {
  makePrng, wobRect, wavyLine, wavyPoints, pointsToBezier, useElementSize,
  HandDrawnBorder, HandDrawnAvatar,
  GrainOverlay, OrganiBlob, ShapeGrain,
  OrganicButton, SectionEdge, TagPill, useIsMobile,
  HamburgerIcon, Modal, ResonanceIcon,
  Avatar: (props) => React.createElement(HandDrawnAvatar, props),
});
