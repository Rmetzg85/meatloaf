import { brandMetadata } from '@/lib/seo'
import AboutStory from '@/COMPONENTS/AboutStory'

// Brand page: always Meatloaf, whatever theme the visitor had before.
export const metadata = brandMetadata('meatloaf', '/about')

export default function AboutPage() {
  return <AboutStory theme="meatloaf" />
}
