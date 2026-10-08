import { privatePageMetadata } from '@/lib/seo'

export const generateMetadata = () => privatePageMetadata('List a Home')

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
