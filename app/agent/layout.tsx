import { privatePageMetadata } from '@/lib/seo'

export const generateMetadata = () => privatePageMetadata('My Listings')

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
