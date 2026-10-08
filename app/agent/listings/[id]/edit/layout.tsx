import { privatePageMetadata } from '@/lib/seo'

export const generateMetadata = () => privatePageMetadata('Edit Listing')

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
