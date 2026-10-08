import { privatePageMetadata } from '@/lib/seo'

export const generateMetadata = () => privatePageMetadata('Your Dashboard', 'mimosa')

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
