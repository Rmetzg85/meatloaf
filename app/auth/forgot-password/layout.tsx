import { pageMetadata } from '@/lib/seo'

export const generateMetadata = () =>
  pageMetadata({
    title: 'Forgot Password',
    path: '/auth/forgot-password',
    describe: (brand) => `Reset the password for your ${brand} account.`,
    noindex: true,
  })

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
