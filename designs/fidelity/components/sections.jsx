// ── Resonance Design System · Section Components ─────────────────────────────

const STORIES = [
  {
    title: "I left my hometown at 18",
    excerpt: "A short reflection on growth, fear, and finding identity in a city that didn't know my name.",
    author: "Alex Chen", authorInitials: "AC", readTime: "3 min read",
    tag: "Identity", imageLabel: "leaving home · portrait",
  },
  {
    title: "The letter I never sent my father",
    excerpt: "Years of silence, one piece of paper, and the conversation that changed everything.",
    author: "Mara Santos", authorInitials: "MS", readTime: "5 min read",
    tag: "Family", imageLabel: "handwritten letter · detail",
  },
  {
    title: "Learning to fail, slowly",
    excerpt: "How three failed startups taught me more about courage than any success ever could.",
    author: "Jin Park", authorInitials: "JP", readTime: "4 min read",
    tag: "Growth", imageLabel: "notebook · workspace",
  },
  {
    title: "My grandmother's kitchen",
    excerpt: "She never wrote down a single recipe. Everything lived in her hands. Here's what I remember.",
    author: "Amara Osei", authorInitials: "AO", readTime: "6 min read",
    tag: "Memory", imageLabel: "kitchen · warm light",
  },
  {
    title: "Three years without speaking",
    excerpt: "Grief doesn't follow a schedule. Neither does healing. This is my timeline.",
    author: "Yuki Tanaka", authorInitials: "YT", readTime: "7 min read",
    tag: "Grief", imageLabel: "quiet room · soft focus",
  },
  {
    title: "The stranger on the night train",
    excerpt: "A five-hour ride, a single conversation, and a perspective I've carried ever since.",
    author: "Léa Moreau", authorInitials: "LM", readTime: "3 min read",
    tag: "Connection", imageLabel: "train window · dusk",
  },
];

// ── SiteHeader ────────────────────────────────────────────────────────────────
function SiteHeader({ onNavigate }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'oklch(96% 0.015 75 / 0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      transition: 'background 300ms ease, backdrop-filter 300ms ease',
      padding: '0 clamp(24px, 5vw, 80px)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 68,
      }}>
        {/* Logo */}
        <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative', width: 32, height: 32 }}>
            <OrganiBlob variant={0} fill="var(--color-terracotta)" size={32}
              style={{ position: 'absolute', inset: 0 }} />
          </div>
          <span style={{
            fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '20px',
            color: 'var(--color-text)', letterSpacing: '-0.02em',
          }}>Resonance</span>
        </a>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          {['About', 'Explore', 'Stories'].map(item => (
            <a key={item} href="#" style={{
              fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: '500',
              color: 'var(--color-text)', textDecoration: 'none', opacity: 0.8,
              transition: 'opacity 150ms',
            }}
              onMouseEnter={e => e.target.style.opacity = 1}
              onMouseLeave={e => e.target.style.opacity = 0.8}
            >{item}</a>
          ))}
        </nav>

        {/* Account */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <OrganicButton variant="outline" style={{ padding: '9px 22px', fontSize: '14px' }}>
            Sign In
          </OrganicButton>
          <HandDrawnAvatar initials="YO" size={36} color="var(--color-terracotta-light)" seed={77} />
        </div>
      </div>

      {/* Hand-drawn wavy underline — sits at the header's own bottom edge,
          on top of the header's translucent background, so it reads as part
          of the header rather than floating over the page body. */}
      <div style={{
        position:'absolute', left:0, right:0, bottom:0, height:10, pointerEvents:'none',
        opacity: scrolled ? 1 : 0, transition: 'opacity 300ms ease',
      }}>
        <svg viewBox="0 0 1440 10" preserveAspectRatio="none" aria-hidden="true"
          style={{ display:'block', width:'100%', height:10, overflow:'visible' }}>
          <path d={wavyLine(1440, 211, 1.8, 18)}
            transform="translate(0, 6)"
            stroke="oklch(55% 0.05 60 / 0.32)" strokeWidth="1.3"
            fill="none" strokeLinecap="round" />
        </svg>
      </div>
    </header>
  );
}

// ── HeroSection ───────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-cream)',
      overflow: 'visible',
      paddingTop: 100,
    }}>
      {/* Background blobs — max 2-3 per section */}
      <div style={{ position: 'absolute', top: '8%', left: '-4%', opacity: 0.35, pointerEvents: 'none' }}>
        <OrganiBlob variant={1} fill="var(--color-terracotta-light)" size={380} />
      </div>
      <div style={{ position: 'absolute', bottom: '10%', right: '-3%', opacity: 0.25, pointerEvents: 'none' }}>
        <OrganiBlob variant={3} fill="var(--color-lavender)" size={300} />
      </div>
      <div style={{ position: 'absolute', top: '45%', right: '10%', opacity: 0.18, pointerEvents: 'none' }}>
        <OrganiBlob variant={2} fill="var(--color-sage)" size={180} />
      </div>

      {/* Grain over entire hero */}
      <GrainOverlay opacity={0.055} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        textAlign: 'center',
        maxWidth: 720,
        padding: '0 clamp(24px, 5vw, 80px)',
      }}>
        <div style={{ marginBottom: 20 }}>
          <TagPill color="var(--color-terracotta-light)">✦ human stories</TagPill>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(42px, 7vw, 84px)',
          fontWeight: '800',
          color: 'var(--color-text)',
          lineHeight: 1.08,
          letterSpacing: '-0.03em',
          margin: '0 0 24px',
          textWrap: 'balance',
        }}>
          Let lives{' '}
          <span style={{
            position: 'relative', display: 'inline-block',
          }}>
            <span style={{ color: 'var(--color-terracotta)' }}>influence</span>
            {/* underline squiggle */}
            <svg viewBox="0 0 200 12" style={{
              position: 'absolute', bottom: -6, left: 0, width: '100%', height: 12, overflow: 'visible',
            }}>
              <path d="M2,8 C30,2 60,12 90,6 C120,0 150,10 198,6"
                stroke="var(--color-terracotta)" strokeWidth="2.5" fill="none"
                strokeLinecap="round" opacity="0.6" />
            </svg>
          </span>
          {' '}lives
        </h1>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(16px, 2vw, 20px)',
          lineHeight: 1.7,
          color: 'var(--color-text-muted)',
          margin: '0 auto 40px',
          maxWidth: 520,
          textWrap: 'pretty',
        }}>
          A space where human stories connect across the world.
          Read, share, and resonate with experiences that shape who we are.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <OrganicButton variant="primary">Explore Stories</OrganicButton>
          <OrganicButton variant="ghost">Share Your Story</OrganicButton>
        </div>

        {/* Floating social proof */}
        <div style={{
          marginTop: 56,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
        }}>
          <div style={{ display: 'flex' }}>
            {['AC','MS','JP','AO'].map((ini, i) => (
              <div key={ini} style={{ marginLeft: i > 0 ? -10 : 0 }}>
                <HandDrawnAvatar initials={ini} size={30} seed={i * 55 + 3}
                  color={['var(--color-terracotta-light)','var(--color-lavender)','var(--color-sage)','var(--color-yellow)'][i]} />
              </div>
            ))}
          </div>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '13px',
            color: 'var(--color-text-muted)', fontStyle: 'italic',
          }}>
            Join 12,000+ storytellers worldwide
          </span>
        </div>
      </div>

    </section>
  );
}

// ── CardFeedSection ───────────────────────────────────────────────────────────
function CardFeedSection() {
  return (
    <section style={{
      position: 'relative',
      background: 'var(--color-cream-dark)',
      padding: 'clamp(96px, 10vw, 140px) clamp(24px, 5vw, 80px) clamp(120px, 14vw, 180px)',
      overflow: 'visible',
    }}>
      {/* Wavy top edge — seals this section against whatever is above and
          clips any blob that bled down from Hero with a hand-drawn line. */}
      <SectionEdge fill="var(--color-cream-dark)" seed={41} height={72}
        amplitude={0.5} steps={14} zIndex={4} />

      {/* Subtle bg blob — now clipped by CTA's SectionEdge, not a hard line */}
      <div style={{ position: 'absolute', bottom: -60, left: -40, opacity: 0.15, pointerEvents: 'none' }}>
        <OrganiBlob variant={4} fill="var(--color-yellow)" size={320} />
      </div>

      <GrainOverlay opacity={0.04} extendTop={72} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <TagPill color="var(--color-sage)">recent stories</TagPill>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: '700',
            color: 'var(--color-text)',
            margin: '16px 0 12px',
            letterSpacing: '-0.025em',
          }}>
            Stories worth reading
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '16px',
            color: 'var(--color-text-muted)', margin: 0, maxWidth: 420, marginInline: 'auto',
          }}>
            Real experiences from real people — every voice carries a world.
          </p>
        </div>

        {/* Card Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {STORIES.map((story, i) => (
            <StoryCard key={i} story={story} index={i} />
          ))}
        </div>

        {/* Load more */}
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <OrganicButton variant="outline">View All Stories</OrganicButton>
        </div>
      </div>

    </section>
  );
}

// ── CTASection ────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section style={{
      position: 'relative',
      background: 'var(--color-terracotta)',
      padding: 'clamp(110px, 12vw, 170px) clamp(24px, 5vw, 80px) clamp(120px, 14vw, 180px)',
      overflow: 'visible',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    }}>
      {/* Wavy top edge — clips CardFeed's bottom blob with a hand-drawn line */}
      <SectionEdge fill="var(--color-terracotta)" seed={137} height={80}
        amplitude={0.55} steps={13} zIndex={4} />

      {/* Decorative blobs — z:0, strictly behind everything */}
      <div style={{ position:'absolute', top:-60, left:'5%', opacity:0.15, pointerEvents:'none', zIndex:0 }}>
        <OrganiBlob variant={2} fill="oklch(98% 0.01 75)" size={280}/>
      </div>
      <div style={{ position:'absolute', bottom:-50, right:'8%', opacity:0.12, pointerEvents:'none', zIndex:0 }}>
        <OrganiBlob variant={0} fill="oklch(98% 0.01 75)" size={220}/>
      </div>

      {/* Grain — extends up over SectionEdge so the wave region picks up the
          same texture and doesn't read as a flat color block. */}
      <GrainOverlay opacity={0.06} extendTop={80}/>

      {/* Content — z:4, clearly above all decoration */}
      <div style={{
        position: 'relative', zIndex: 4,
        maxWidth: 600, width: '100%',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(30px, 4.5vw, 52px)',
          fontWeight: '800',
          color: 'var(--color-cream)',
          margin: '0 0 16px',
          lineHeight: 1.15,
          letterSpacing: '-0.025em',
          textWrap: 'balance',
        }}>
          Share your story and let the world hear your voice
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '17px',
          color: 'oklch(96% 0.015 75 / 0.8)',
          margin: '0 0 40px',
          lineHeight: 1.65,
        }}>
          Every story matters. Yours could be the one that changes someone's day.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <OrganicButton variant="ctaLight">Start Sharing</OrganicButton>
          <OrganicButton variant="ctaGhost">Create a Story</OrganicButton>
        </div>
      </div>

    </section>
  );
}

// ── SiteFooter ────────────────────────────────────────────────────────────────
function SiteFooter() {
  const links = ['About', 'Contact', 'Privacy Policy', 'Terms of Service'];
  return (
    <footer style={{
      background: 'var(--color-text)',
      padding: 'clamp(88px, 9vw, 120px) clamp(24px, 5vw, 80px) clamp(40px, 5vw, 64px)',
      position: 'relative',
      overflow: 'visible',
    }}>
      <SectionEdge fill="var(--color-text)" seed={233} height={72}
        amplitude={0.5} steps={14} zIndex={4} />
      <GrainOverlay opacity={0.04} extendTop={72} />
      <div style={{
        maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28,
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <OrganiBlob variant={0} fill="var(--color-terracotta)" size={24} />
          <span style={{
            fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '18px',
            color: 'var(--color-cream)',
          }}>Resonance</span>
        </div>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '13px',
          color: 'oklch(85% 0.015 75 / 0.5)',
          margin: 0, fontStyle: 'italic',
        }}>
          "Let lives influence lives"
        </p>

        {/* Links */}
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
          {links.map(l => (
            <a key={l} href="#" style={{
              fontFamily: 'var(--font-body)', fontSize: '13px',
              color: 'oklch(85% 0.015 75 / 0.55)',
              textDecoration: 'none', transition: 'color 150ms',
            }}
              onMouseEnter={e => e.target.style.color = 'oklch(85% 0.015 75 / 0.9)'}
              onMouseLeave={e => e.target.style.color = 'oklch(85% 0.015 75 / 0.55)'}
            >{l}</a>
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1, background: 'oklch(85% 0.015 75 / 0.1)' }} />

        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '12px',
          color: 'oklch(85% 0.015 75 / 0.3)',
          margin: 0,
        }}>
          © 2026 Resonance. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

Object.assign(window, { SiteHeader, HeroSection, CardFeedSection, CTASection, SiteFooter, STORIES });
