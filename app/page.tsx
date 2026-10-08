import { brandMetadata } from '@/lib/seo'
import Landing from '@/COMPONENTS/Landing'

// Brand page: always Meatloaf, whatever theme the visitor had before.
export const metadata = brandMetadata('meatloaf', '/')

export default function HomePage() {
  return <Landing theme="meatloaf" />
}
