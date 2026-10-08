import { brandMetadata } from '@/lib/seo'
import AboutStory from '@/COMPONENTS/AboutStory'

// Brand page: always Mimosa, and it keeps the rest of the visit on Mimosa.
export const metadata = brandMetadata('mimosa', '/mimosa/about', {
  title: 'My Story',
  description: 'Why founder Ryan Metzgar built Mimosa: a free credit game and starter homes under $300K for millennials stuck renting or back home.',
})

export default function MimosaAboutPage() {
  return <AboutStory theme="mimosa" />
}
