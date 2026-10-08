import { pageMetadata } from '@/lib/seo'

export const generateMetadata = () =>
  pageMetadata({
    title: 'Create a Free Account',
    path: '/auth/signup',
    describe: (brand) => `Create a free ${brand} account to play the credit game with a practice score and save starter homes under $300K. No credit pull.`,
  })

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
