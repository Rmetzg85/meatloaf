import { pageMetadata } from '@/lib/seo'

export const generateMetadata = () =>
  pageMetadata({
    title: 'Sign In',
    path: '/auth/login',
    describe: (brand) => `Sign in to your ${brand} account.`,
  })

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
