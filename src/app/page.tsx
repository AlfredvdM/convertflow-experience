import { HeroWithGameForm } from '@/components/marketing/header-section/hero-with-game-form'
import { FeaturesIconsAndImage02 } from '@/components/marketing/features/features-icons-and-image-02'
import { FeaturesCenterMockup01 } from '@/components/marketing/features/features-center-mockup-01'
import { FeaturesCenterMockup02 } from '@/components/marketing/features/features-center-mockup-02'
import { CTASplitImage04 } from '@/components/marketing/cta/cta-split-image-04'
import { FooterLarge15 } from '@/components/marketing/footers/footer-large-15'

export default function Home() {
  return (
    <main className="min-h-screen bg-primary">
      <HeroWithGameForm />
      <FeaturesIconsAndImage02 />
      <FeaturesCenterMockup01 />
      <FeaturesCenterMockup02 />
      <CTASplitImage04 />
      <FooterLarge15 />
    </main>
  )
}
