import { pageMetadata } from '@/lib/seo'

export const generateMetadata = () =>
  pageMetadata({
    title: 'Starter Homes Under $300K',
    path: '/properties',
    describe: (brand) => `Browse starter homes under $300K on ${brand}. Search by city or state, then confirm details with the listing source.`,
  })

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
