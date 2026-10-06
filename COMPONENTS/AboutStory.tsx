import Link from 'next/link'
import SiteNav from './SiteNav'
import SiteFooter from './SiteFooter'
import { THEMES, type ThemeKey } from './theme'

export default function AboutStory({ theme }: { theme: ThemeKey }) {
  const t = THEMES[theme]
  const label = `text-sm font-bold uppercase tracking-widest ${t.accentText} mb-4`
  return (
    <div className="min-h-screen bg-white">
      <SiteNav theme={theme} active="about" />

      {/* Hero */}
      <section className={t.aboutHero}>
        <div className="py-16 md:py-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight text-white">
            I Graduated in 2008.<br />You Know What Happened Next.
          </h1>
          <p className={`text-lg md:text-xl lg:text-2xl ${t.aboutHeroText} leading-relaxed max-w-2xl`}>
            This is my story. And the story of millions of millennials who were sold a lie.
          </p>
        </div>
      </section>

      {/* Main story */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-12 md:mb-16">
            <p className={label}>The Story</p>
            <div className="space-y-6 text-gray-700 text-base md:text-lg leading-relaxed">
              <p>
                Like millions of other millennials, I was told that regardless of the degree, college was a necessary prerequisite to live a successful life.
              </p>
              <p>
                FAFSA nights were treated like senior milestones — more important than teaching about wealth, ownership, or financial literacy. Student loans were handed out like candy on Halloween. Meanwhile, the higher education industrial complex was pushing graduates right back to their parents&apos; basements.
              </p>
              <p>
                I graduated in 2008. If you remember that year, you know what I&apos;m talking about. The housing market collapsed. The economy tanked. Jobs disappeared. And millions of us — degree in hand, debt on our backs — moved home.
              </p>
              <p>
                Next thing you know, millennials in their mid-20s and 30s were screaming &quot;MA! THE MEATLOAF!&quot; like Will Ferrell in <em>Wedding Crashers</em>. Except it wasn&apos;t funny. It was our reality.
              </p>
            </div>
          </div>

          <div className="mb-12 md:mb-16">
            <p className={label}>The Realization</p>
            <div className="space-y-6 text-gray-700 text-base md:text-lg leading-relaxed">
              <p>
                Here&apos;s what keeps me up at night: If I could go back to 2008 with $50,000, would I choose a college degree or a down payment on a starter home?
              </p>
            </div>
            <blockquote className={`my-8 md:my-10 border-l-4 ${t.accentBorder} pl-6`}>
              <p className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">
                &quot;The degree got me credentials and debt.<br />A home would&apos;ve given me equity and wealth.&quot;
              </p>
            </blockquote>
            <div className="space-y-6 text-gray-700 text-base md:text-lg leading-relaxed">
              <p>
                Nobody ever showed me those two options side by side with real numbers. That&apos;s the part I want to fix. I&apos;m not alone.
              </p>
            </div>
          </div>

          <div className="mb-12 md:mb-16">
            <p className={label}>The Mission</p>
            <div className="space-y-6 text-gray-700 text-base md:text-lg leading-relaxed">
              <p className="text-xl md:text-2xl font-bold text-gray-900">That&apos;s why I built {t.name}.</p>
              <p>
                A free place to learn how credit and mortgages work through a game that uses a practice score, plus a board of starter homes under $300K. Honest, a little funny, and free to start.
              </p>
              <p>
                We don&apos;t report to credit bureaus, we don&apos;t pull or change your credit, and we don&apos;t promise a score, an approval, or a move-out date. Licensed agents and lenders give the professional advice; we help you show up prepared.
              </p>
            </div>
            <blockquote className="my-8 md:my-10 bg-gray-900 text-white rounded-2xl p-6 md:p-8">
              <p className="text-xl md:text-2xl font-black leading-snug mb-0">&quot;Homeownership is the new college degree.&quot;</p>
              <p className="text-gray-400 mt-3 text-sm md:text-base">
                And we&apos;re building the platform to make it accessible to everyone who was told the old path was the only path.
              </p>
            </blockquote>
          </div>

          <div className="mb-12 md:mb-16">
            <p className={label}>The Builder</p>
            <div className="space-y-6 text-gray-700 text-base md:text-lg leading-relaxed">
              <p>
                I&apos;m Ryan Metzgar. I taught myself to code in 12 months using AI assistance. I built this entire platform solo while working full-time for the Maryland state government.
              </p>
              <p>
                I&apos;m not a Silicon Valley founder with venture backing and a Stanford degree. I&apos;m a millennial who lived in his parents&apos; basement, paid off student loans, and decided to build the solution I wish existed when I was 22.
              </p>
              <p>
                {t.name} is operated by REMVentures LLC. It isn&apos;t funded by VCs (yet). It&apos;s built by someone who knows what it feels like to be stuck, to be told you did everything right, and to realize the system was rigged against you from the start.
              </p>
            </div>
          </div>

          <div className="mb-4">
            <p className={`text-sm font-bold uppercase tracking-widest ${t.accentText} mb-6`}>The Invitation</p>
            <div className="space-y-3 text-gray-700 text-base md:text-lg leading-relaxed mb-10">
              <p>If you&apos;re living at home and tired of feeling stuck, <strong className="text-gray-900">this is for you.</strong></p>
              <p>If you&apos;re renting and wondering how anyone saves for a down payment, <strong className="text-gray-900">this is for you.</strong></p>
              <p>If you&apos;re a parent watching your kid struggle with the same broken system you did, <strong className="text-gray-900">this is for you.</strong></p>
            </div>
            <div className={`${t.softBg} rounded-2xl p-6 md:p-8 space-y-3 text-gray-700 text-base md:text-lg leading-relaxed`}>
              <p>Let&apos;s build something different.</p>
              <p>Let&apos;s learn how credit actually works.</p>
              <p>Let&apos;s find real starter homes.</p>
              <p>Let&apos;s build wealth, not debt.</p>
              <p className="text-xl md:text-2xl font-black text-gray-900 pt-2">Join me.</p>
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className={`${t.gradient} text-white py-16 md:py-20`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">Ready to write a different story?</h2>
          <Link
            href="/auth/signup"
            className={`inline-block bg-white ${t.primaryBtnText} px-8 md:px-10 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transition transform hover:-translate-y-1`}
          >
            Play the Credit Game, Free
          </Link>
          <p className={`${t.ctaSubText} mt-6 text-sm`}>Free. No credit pull. We don&apos;t report to credit bureaus.</p>
        </div>
      </section>

      <SiteFooter theme={theme} />
    </div>
  )
}
