import { privatePageMetadata } from '@/lib/seo'

export const generateMetadata = () => privatePageMetadata('Manage a Listing')

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
