// ── Resonance Design System · Story Card (v4) ────────────────────────────────
// Border: wobRect SVG bezier path — no feDisplacementMap, no broken lines
// Fill: same path + chalk texture (feTurbulence blend only, no displacement)
// Colored stroke matching each card's accent family

const CARD_FILLS = [
  'oklch(88% 0.07 55)',
  'oklch(92% 0.035 290)', // lavender — lightened
  'oklch(91% 0.045 140)', // sage — lightened
  'oklch(90% 0.08 88)',
  'oklch(90% 0.035 215)', // sky — noticeably lightened (was 84% / 0.06)
  'oklch(87% 0.05 18)',
];

const CARD_BORDERS = [
  ['oklch(52% 0.13 55)',  'oklch(38% 0.11 55)' ],
  ['oklch(54% 0.10 290)', 'oklch(42% 0.09 290)'],
  ['oklch(50% 0.12 140)', 'oklch(38% 0.11 140)'],
  ['oklch(58% 0.14 88)',  'oklch(44% 0.12 88)' ],
  ['oklch(50% 0.10 215)', 'oklch(38% 0.09 215)'],
  ['oklch(52% 0.09 18)',  'oklch(40% 0.08 18)' ],
];

// Hue values extracted from fills for tinting the card interior
const CARD_HUES = [55, 290, 140, 88, 215, 18];

function ImagePlaceholder({ label, accentFill, index }) {
  const stripeFill = accentFill.replace(/(\d+)%/, (_, n) => `${Math.max(0, +n - 7)}%`);
  return (
    <div style={{
      position: 'relative', width: '100%', paddingBottom: '62%',
      borderRadius: '14px 18px 12px 16px', overflow: 'hidden', flexShrink: 0,
    }}>
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}
        viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="320" height="200" fill={accentFill}/>
        {Array.from({ length: 22 }, (_, i) => (
          <line key={i}
            x1={i * 22 - 160} y1="0" x2={i * 22 + 160} y2="200"
            stroke={stripeFill} strokeWidth="1.5" strokeOpacity="0.28"/>
        ))}
        <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle"
          fontFamily="monospace" fontSize="10.5" fill="oklch(28% 0.04 60)" fillOpacity="0.42">
          {label}
        </text>
      </svg>
      <GrainOverlay opacity={0.055}/>
    </div>
  );
}

function StoryCard({ story, index = 0, isLast = false }) {
  const [hovered, setHovered] = React.useState(false);
  const [pos, setPos]         = React.useState({ x: 0, y: 0 });
  const cardRef = React.useRef(null);
  const { w, h } = useElementSize(cardRef, 340, 480);
  const isMobile = useIsMobile();
  const maskId = React.useId().replace(/:/g, '');

  const recordPointer = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };
  // Farthest-corner distance — radius needed to fully cover the card from
  // the current pointer position, so the spread always reaches every edge.
  const maxR = Math.hypot(
    Math.max(pos.x, w - pos.x),
    Math.max(pos.y, h - pos.y)
  ) + 6;

  const accentFill = CARD_FILLS[index % CARD_FILLS.length];
  const [bc1] = CARD_BORDERS[index % CARD_BORDERS.length];
  const hue        = CARD_HUES[index % CARD_HUES.length];
  const seed       = index * 77 + 13;
  const R          = 22;

  // Near-white interior, faintly tinted with the card's accent hue
  const cardInterior = `oklch(97.5% 0.012 ${hue})`;
  const cardHovered  = `oklch(95.8% 0.016 ${hue})`;

  // Hand-drawn horizontal divider used on mobile (top/bottom section edges)
  const dividerPath = React.useMemo(
    () => wavyLine(200, seed + 17, 1.4, 7),
    [seed]
  );

  // Wob-rect path reused by the brush hover overlay (desktop)
  const borderPath = React.useMemo(() => {
    if (!w || !h) return '';
    return wobRect(w, h, R, seed, Math.min(w, h) * 0.025,
      { segmentsH: [3, 4], segmentsV: [5, 6], curve: 0.55, cornerJitter: 0.7, cornerOffset: 4 });
  }, [w, h, R, seed]);

  // Mobile: cards span full viewport width (bleed out of section padding)
  // — negative margin pulls edges past the section's horizontal padding, and
  // inner padding pushes the content back inside the viewport.
  const mobileBleed = 'clamp(24px, 5vw, 80px)';

  return (
    <article
      ref={cardRef}
      onMouseEnter={(e) => { recordPointer(e); setHovered(true); }}
      onMouseLeave={(e) => { recordPointer(e); setHovered(false); }}
      style={{
        position: 'relative',
        cursor: 'pointer',
        padding: isMobile ? `32px calc(18px + ${mobileBleed})` : '22px',
        marginLeft: isMobile ? `calc(-1 * ${mobileBleed})` : 0,
        marginRight: isMobile ? `calc(-1 * ${mobileBleed})` : 0,
        background: isMobile ? cardInterior : 'transparent',
        transition: 'background 320ms ease',
      }}
    >
      {isMobile ? (
        <>
          {/* Top divider — centered on the card's top edge */}
          <svg viewBox="0 0 200 6" preserveAspectRatio="none" aria-hidden="true"
            style={{ position:'absolute', top:-3, left:0, width:'100%', height:6, overflow:'visible', pointerEvents:'none' }}>
            <path d={dividerPath} transform="translate(0,3)"
              stroke={bc1} strokeWidth="1.4" fill="none" strokeLinecap="round"
              vectorEffect="non-scaling-stroke" />
          </svg>
          {/* Bottom divider — only on the last card; otherwise the next
              card's top divider closes the section. */}
          {isLast && (
            <svg viewBox="0 0 200 6" preserveAspectRatio="none" aria-hidden="true"
              style={{ position:'absolute', bottom:-3, left:0, width:'100%', height:6, overflow:'visible', pointerEvents:'none' }}>
              <path d={dividerPath} transform="translate(0,3)"
                stroke={bc1} strokeWidth="1.4" fill="none" strokeLinecap="round"
                vectorEffect="non-scaling-stroke" />
            </svg>
          )}
        </>
      ) : (
        <>
          {/* Layer 1 — base fill (no stroke). Stroke is drawn as a separate
              top layer below so the hover overlay never covers the border. */}
          <HandDrawnBorder
            w={w} h={h} R={R} seed={seed}
            fillColor={cardInterior}
            strokeColor="transparent"
            strokeWidth={0}
            chalkSeed={index}
            segmentsH={[3, 4]} segmentsV={[5, 6]}
            curve={0.55} cornerJitter={0.7} cornerOffset={4}
          />
          {/* Layer 2 — paint-spreading hover overlay. A circle in the mask
              expands outward from the pointer's entry coordinates with
              linear easing, so the tint bleeds uniformly from the cursor
              like ink spreading on paper. */}
          {w > 0 && h > 0 && (
            <svg aria-hidden="true" width={w} height={h} viewBox={`0 0 ${w} ${h}`}
              style={{ position:'absolute', top:0, left:0, overflow:'visible', pointerEvents:'none', zIndex:0 }}>
              <defs>
                <mask id={`brush-${maskId}`} maskUnits="userSpaceOnUse"
                  x={-w} y={-h} width={w * 3} height={h * 3}>
                  <circle cx={pos.x} cy={pos.y} r={hovered ? maxR : 0} fill="white"
                    style={{ transition: 'r 720ms linear' }} />
                </mask>
              </defs>
              <g mask={`url(#brush-${maskId})`}>
                <path d={borderPath} fill={cardHovered}/>
              </g>
            </svg>
          )}
          {/* Layer 3 — stroke-only border on top, so neither the base fill
              nor the hover overlay can thin out the line. */}
          <HandDrawnBorder
            w={w} h={h} R={R} seed={seed}
            strokeColor={bc1}
            segmentsH={[3, 4]} segmentsV={[5, 6]}
            curve={0.55} cornerJitter={0.7} cornerOffset={4}
          />
        </>
      )}

      {/* Card content — z-index above the SVG border layer */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <ImagePlaceholder
          label={story.imageLabel || 'story illustration'}
          accentFill={accentFill}
          index={index}
        />

        <div><TagPill color={accentFill}>{story.tag}</TagPill></div>

        <h3 style={{
          fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '700',
          color: 'var(--color-text)', lineHeight: 1.3, margin: 0,
        }}>{story.title}</h3>

        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.65,
          color: 'var(--color-text-muted)', margin: 0,
        }}>{story.excerpt}</p>

        {/* Wavy hand-drawn separator above the author row */}
        <svg viewBox="0 0 200 6" preserveAspectRatio="none" aria-hidden="true"
          style={{ display:'block', width:'100%', height:6, marginTop:2, overflow:'visible' }}>
          <path d={wavyLine(200, seed + 91, 1.2, 6)}
            transform="translate(0, 3)"
            stroke={`oklch(55% 0.04 ${hue} / 0.4)`} strokeWidth="1.1"
            fill="none" strokeLinecap="round" />
        </svg>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '8px',
        }}>
          <HandDrawnAvatar initials={story.authorInitials} size={30} color={accentFill} seed={story.authorInitials.charCodeAt(0) * 13}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily:'var(--font-body)', fontSize:'13px', fontWeight:'600', color:'var(--color-text)' }}>
              {story.author}
            </div>
            <div style={{ fontFamily:'var(--font-body)', fontSize:'12px', color:'var(--color-text-muted)' }}>
              {story.readTime}
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
            style={{ opacity: hovered ? 0.7 : 0.28, transition: 'opacity 180ms' }}>
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </article>
  );
}

Object.assign(window, { StoryCard });
