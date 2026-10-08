import { privatePageMetadata } from '@/lib/seo'

export const generateMetadata = () => privatePageMetadata('Listings Dashboard')

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
