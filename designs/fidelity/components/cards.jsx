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

function StoryCard({ story, index = 0 }) {
  const [hovered, setHovered] = React.useState(false);
  const cardRef = React.useRef(null);
  const { w, h } = useElementSize(cardRef, 340, 480);

  const accentFill = CARD_FILLS[index % CARD_FILLS.length];
  const [bc1] = CARD_BORDERS[index % CARD_BORDERS.length];
  const hue        = CARD_HUES[index % CARD_HUES.length];
  const seed       = index * 77 + 13;
  const R          = 22;

  // Near-white interior, faintly tinted with the card's accent hue
  const cardInterior = `oklch(97.5% 0.012 ${hue})`;
  const cardHovered  = `oklch(95.8% 0.016 ${hue})`;

  return (
    <article
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        cursor: 'pointer',
        padding: '22px',
        transform: hovered
          ? 'translateY(-5px) rotate(0.3deg)'
          : 'translateY(0) rotate(0deg)',
        transition: 'transform 230ms cubic-bezier(.34,1.4,.64,1)',
      }}
    >
      {/*
       * Hand-drawn border + fill: pure SVG bezier paths (wobRect).
       * No feDisplacementMap on strokes → zero broken pixels.
       * Chalk texture is applied to fill interior via feBlend (no displacement).
       */}
      <HandDrawnBorder
        w={w} h={h} R={R} seed={seed}
        fillColor={hovered ? cardHovered : cardInterior}
        strokeColor={bc1}
        chalkSeed={index}
        segmentsH={[3, 4]} segmentsV={[5, 6]}
      />

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
