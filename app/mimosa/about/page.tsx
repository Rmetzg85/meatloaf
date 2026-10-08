import { brandMetadata } from '@/lib/seo'
import AboutStory from '@/COMPONENTS/AboutStory'

// Brand page: always Mimosa, and it keeps the rest of the visit on Mimosa.
export const metadata = brandMetadata('mimosa', '/mimosa/about')

export default function MimosaAboutPage() {
  return <AboutStory theme="mimosa" />
}
