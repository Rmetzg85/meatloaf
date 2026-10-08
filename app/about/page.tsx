import { brandMetadata } from '@/lib/seo'
import AboutStory from '@/COMPONENTS/AboutStory'

// Brand page: always Meatloaf, whatever theme the visitor had before.
export const metadata = brandMetadata('meatloaf', '/about', {
  title: 'My Story',
  description: 'Why founder Ryan Metzgar built Meatloaf: a free credit game and starter homes under $300K for millennials stuck renting or back home.',
})

export default function AboutPage() {
  return <AboutStory theme="meatloaf" />
}
