import AboutStory from '@/COMPONENTS/AboutStory'

// Brand page: always Meatloaf, whatever theme the visitor had before.
export const metadata = { title: 'Meatloaf - Stop Renting Forever' }

export default function AboutPage() {
  return <AboutStory theme="meatloaf" />
}
