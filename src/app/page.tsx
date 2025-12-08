import { HeroWithGameForm } from '@/components/marketing/header-section/hero-with-game-form'
import { FeaturesIconsAndImage02 } from '@/components/marketing/features/features-icons-and-image-02'
import { FeaturesCenterMockup01 } from '@/components/marketing/features/features-center-mockup-01'
import { FeaturesCenterMockup02 } from '@/components/marketing/features/features-center-mockup-02'
import { SocialProofFullWidth } from '@/components/marketing/social-proof/social-proof-full-width'
import { NewsletterCardVerticalBrand } from '@/components/marketing/newsletter-cta/newsletter-card-vertical-brand'
import { FooterLarge15 } from '@/components/marketing/footers/footer-large-15'

export default function Home() {
  return (
    <main className="min-h-screen bg-primary">
      <HeroWithGameForm />
      <SocialProofFullWidth />
      <FeaturesIconsAndImage02 />
      <FeaturesCenterMockup01 />
      <FeaturesCenterMockup02 />
      <NewsletterCardVerticalBrand />
      <FooterLarge15 />
    </main>
  )
}
