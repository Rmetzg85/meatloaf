import { brandMetadata } from '@/lib/seo'
import Landing from '@/COMPONENTS/Landing'

// Brand page: always Mimosa, and it keeps the rest of the visit on Mimosa.
export const metadata = brandMetadata('mimosa', '/mimosa')

export default function MimosaHomePage() {
  return <Landing theme="mimosa" />
}
