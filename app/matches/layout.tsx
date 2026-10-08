import { privatePageMetadata } from '@/lib/seo'

export const generateMetadata = () => privatePageMetadata('Your Home Matches')

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
