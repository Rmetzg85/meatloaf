import { privatePageMetadata } from '@/lib/seo'

export const generateMetadata = () => privatePageMetadata('Your Home Preferences')

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
