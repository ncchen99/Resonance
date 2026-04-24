import { setRequestLocale } from 'next-intl/server';
import { SiteHeader } from '@/components/sections/SiteHeader/SiteHeader';
import { HeroSection } from '@/components/sections/HeroSection/HeroSection';
import { CardFeedSection } from '@/components/sections/CardFeedSection/CardFeedSection';
import { CTASection } from '@/components/sections/CTASection/CTASection';
import { SiteFooter } from '@/components/sections/SiteFooter/SiteFooter';
import { STORIES } from '@/lib/mock/stories';

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <CardFeedSection stories={STORIES} />
        <CTASection />
      </main>
      <SiteFooter />
    </>
  );
}
