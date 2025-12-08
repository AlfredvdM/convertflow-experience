import { HeroWithGameForm } from '@/components/marketing/header-section/hero-with-game-form'
import { FeaturesIconsAndImage04 } from '@/components/marketing/features/features-icons-and-image-04'
import { FeaturesIconCards01 } from '@/components/marketing/features/features-icon-cards-01'
import { FeaturesAlternatingLayout01 } from '@/components/marketing/features/features-alternating-layout-01'
import { FooterSmall02Brand } from '@/components/marketing/footers/footer-small-02-brand'

export default function Home() {
  return (
    <main className="min-h-screen bg-primary">
      <HeroWithGameForm />
      <FeaturesIconsAndImage04 />
      <FeaturesIconCards01 />
      <FeaturesAlternatingLayout01 />
      <FooterSmall02Brand />
    </main>
  )
}
