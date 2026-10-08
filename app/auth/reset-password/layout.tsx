import { pageMetadata } from '@/lib/seo'

export const generateMetadata = () =>
  pageMetadata({
    title: 'Set a New Password',
    path: '/auth/reset-password',
    describe: (brand) => `Choose a new password for your ${brand} account.`,
    noindex: true,
  })

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
