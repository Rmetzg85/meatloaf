import Landing from '@/COMPONENTS/Landing'

// Brand page: always Meatloaf, whatever theme the visitor had before.
export const metadata = { title: 'Meatloaf - Stop Renting Forever' }

export default function HomePage() {
  return <Landing theme="meatloaf" />
}
