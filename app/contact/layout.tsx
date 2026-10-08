import { pageMetadata } from '@/lib/seo'

export const generateMetadata = () =>
  pageMetadata({
    title: 'Contact',
    path: '/contact',
    describe: (brand) => `Questions, partnerships, press or agent inquiries? Get in touch with the ${brand} team at REMVentures LLC.`,
  })

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
