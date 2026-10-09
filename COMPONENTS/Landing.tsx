import Link from 'next/link'
import { Home, Award, Shield, Users, BookOpen, Calculator, Check, X as XIcon } from 'lucide-react'
import SiteNav from './SiteNav'
import SiteFooter from './SiteFooter'
import ThemeSetter from './ThemeSetter'
import AgentsCTA from './AgentsCTA'
import { THEMES, MARKET_STAT, type ThemeKey } from './theme'

const HERO: Record<ThemeKey, { h1: [string, string, string]; sub: string; body: string }> = {
  meatloaf: {
    h1: ["You're 30.", "Mom's Making Meatloaf.", 'Again.'],
    sub: "Living in the basement wasn't the plan. Let's work on the way out.",
    body: "You've got a job. You're responsible. But the path from \u201cpullout couch\u201d to \u201cmy name on the deed\u201d never got explained to you.",
  },
  mimosa: {
    h1: ['Hungover.', 'Childhood Home.', "Dad's Texting Again."],
    sub: "Brunch got out of hand and you're back in your old room. Let's work on the way out.",
    body: "You've got a job. You're capable. But the path from \u201csame curtains since middle school\u201d to \u201cmy name on the deed\u201d never got explained to you.",
  },
}

export default function Landing({ theme }: { theme: ThemeKey }) {
  const t = THEMES[theme]
  const hero = HERO[theme]
  const other = theme === 'meatloaf' ? THEMES.mimosa : THEMES.meatloaf

  return (
    <div data-theme={theme} className={`min-h-screen ${t.pageBg}`}>
      <ThemeSetter theme={theme} />
      <SiteNav theme={theme} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className={`relative text-white ${theme === 'mimosa' ? 'pt-64 pb-24 md:pt-80 xl:py-24 bg-rose-950' : 'py-24 bg-gray-950'}`}>
          {theme === 'meatloaf' && (
            <>
              {/* Decorative loop — muted, no captions needed */}
              <video
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/hero-basement.jpg"
                aria-hidden="true"
                tabIndex={-1}
              >
                <source src="/hero-basement.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-950/75 via-purple-950/70 to-gray-950/80" aria-hidden="true" />
            </>
          )}
          {theme === 'mimosa' && (
            <>
              {/* Decorative loop — muted, no captions needed (still at /hero-mimosa.jpg|.webp kept as spare) */}
              <video
                className="absolute inset-x-0 top-0 h-[480px] md:h-[560px] w-full object-cover object-[40%_20%] xl:inset-y-0 xl:left-0 xl:right-auto xl:h-full xl:w-[60%] xl:object-[55%_25%] xl:[mask-image:linear-gradient(to_right,black_60%,transparent)]"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/hero-mimosa-poster.jpg"
                aria-hidden="true"
                tabIndex={-1}
              >
                <source src="/hero-mimosa.mp4" type="video/mp4" />
              </video>
              {/* Below xl: video band on top fading into the copy. xl+: video fills the left 60% (fades right) so she sits beside the headline */}
              <div className="absolute inset-x-0 top-0 h-[480px] md:h-[560px] bg-gradient-to-b from-rose-950/10 via-rose-950/60 to-rose-950 xl:hidden" aria-hidden="true" />
              <div className="absolute inset-0 hidden xl:block bg-gradient-to-br from-rose-950/70 via-pink-900/55 to-gray-950/75" aria-hidden="true" />
            </>
          )}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
                {hero.h1[0]}<br />{hero.h1[1]}<br />{hero.h1[2]}
              </h1>
              <p className={`text-xl md:text-2xl font-semibold ${t.heroAccent} mb-6`}>{hero.sub}</p>
              <div className={`text-left bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-10 space-y-4 ${t.heroBody} text-lg leading-relaxed`}>
                <p>{hero.body}</p>
                <p className="font-semibold text-white">
                  {t.name} is a free place to learn how credit and mortgages actually work and to browse real starter homes under $300K. No lectures, no gimmicks, and nobody touches your credit.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/properties" className={`bg-white ${t.primaryBtnText} px-8 py-4 rounded-lg font-bold text-lg hover:shadow-xl transition transform hover:-translate-y-1`}>
                  Browse Homes Under $300K
                </Link>
                <Link href="/auth/signup" className={`${t.secondaryBtn} text-white px-8 py-4 rounded-lg font-bold text-lg transition border-2 border-white/30`}>
                  Play the Credit Game, Free
                </Link>
              </div>
              <p className={`mt-6 text-sm ${t.heroAccent}`}>Free. No bank connection. No credit pull. We don&apos;t report to credit bureaus.</p>
              <p className="mt-3 text-sm text-white/80">
                {t.name} and {other.name} are two takes on the same story: same homes, same free game.{' '}
                <Link href={other.home} className="underline hover:text-white">Try the {other.name} theme</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Market stat */}
      <section className={`${t.sectionBg} border-b border-black/5`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 text-center">
          <p className="text-lg md:text-2xl font-semibold text-gray-900 leading-snug">
            About{' '}
            <span className={`font-black ${t.gradientText}`}>{MARKET_STAT.homes.toLocaleString('en-US')}</span>{' '}
            homes are for sale under $300K across the US right now.
          </p>
          <p className="mt-2 text-xs md:text-sm text-gray-600">
            Estimate based on {MARKET_STAT.source}, {MARKET_STAT.asOf}.
          </p>
        </div>
      </section>

      {/* Two Paths */}
      <section id="path" className="py-20 bg-gray-950 text-white scroll-mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4">Two paths. Run your own numbers.</h2>
          <p className="text-center text-gray-400 text-xl mb-14 max-w-3xl mx-auto">
            College can be worth it. So can a starter home. Most people never see the math side by side, so we&apos;re building a calculator that does that.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🎓</span>
                <h3 className="text-2xl font-black text-gray-100">The Diploma-First Path</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Tuition and loan payments up front, then renting while you pay them down. Plug in <em>your</em> tuition, <em>your</em> rent, and <em>your</em> loan rate.
              </p>
            </div>
            <div className={`${t.pathCard} rounded-2xl p-8`}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🏠</span>
                <h3 className={`text-2xl font-black ${t.pathTitle}`}>The Deed-First Path</h3>
              </div>
              <p className="text-gray-200 leading-relaxed">
                Save for a down payment, buy a starter home, and build equity as you pay down the loan. Plug in <em>your</em> price, <em>your</em> rate, and <em>your</em> down payment.
              </p>
            </div>
          </div>
          <div className="text-center mt-10">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-6 py-3 rounded-lg font-semibold">
              <Calculator className="w-5 h-5" /> The Path calculator: coming soon
            </span>
          </div>
          <p className="text-center text-gray-600 text-sm mt-6 max-w-3xl mx-auto">
            The calculator is illustrative and uses the assumptions you enter. Home values can fall as well as rise. Owning has costs that renting doesn&apos;t (taxes, insurance, repairs, HOA). It isn&apos;t financial advice and doesn&apos;t predict your results.
          </p>
        </div>
      </section>

      {/* Homes Under $300K */}
      <section className={`py-20 ${t.sectionBg}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Starter homes under $300K. Real listings, real links.</h2>
          <p className="text-xl text-gray-700 mb-10 leading-relaxed">
            We&apos;re building a board of public, government-owned homes for sale plus homes listed by licensed local agents. Every card links to the official listing, so you&apos;re always dealing with the real source.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left mb-10">
            <div className="bg-white/85 ring-1 ring-black/5 shadow-sm rounded-xl p-6">
              <Home className={`w-8 h-8 ${t.accentText} mb-3`} />
              <p className="text-gray-700"><strong>Coming soon:</strong> government-owned homes from HUD&apos;s public inventory, updated from HUD&apos;s open data</p>
            </div>
            <div className="bg-white/85 ring-1 ring-black/5 shadow-sm rounded-xl p-6">
              <Users className={`w-8 h-8 ${t.accentText} mb-3`} />
              <p className="text-gray-700"><strong>Coming soon:</strong> homes listed directly by licensed agents, with the brokerage shown on every listing</p>
            </div>
            <div className="bg-white/85 ring-1 ring-black/5 shadow-sm rounded-xl p-6">
              <BookOpen className={`w-8 h-8 ${t.accentText} mb-3`} />
              <p className="text-gray-700">
                Links to official boards:{' '}
                <a href="https://homepath.fanniemae.com/" className="underline" target="_blank" rel="noopener noreferrer">Fannie Mae HomePath</a>,{' '}
                <a href="https://www.homesteps.com/" className="underline" target="_blank" rel="noopener noreferrer">Freddie Mac HomeSteps</a>,{' '}
                <a href="https://properties.sc.egov.usda.gov/resales/" className="underline" target="_blank" rel="noopener noreferrer">USDA Rural Development</a>
              </p>
            </div>
          </div>
          <Link href="/properties" className={`inline-block ${t.gradient} text-white px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition`}>
            Search homes by state or ZIP
          </Link>
          <p className="text-gray-600 text-sm mt-4">
            The board is just getting started, so you may see only a few homes (or none) for now.
          </p>
          <p className="text-gray-600 text-xs mt-4 max-w-3xl mx-auto">
            {t.name} isn&apos;t affiliated with HUD, Fannie Mae, Freddie Mac, or USDA. Listings come from public sources or the listing agent and may be out of date. Confirm price and availability with the listing source. HUD homes must be bid on through a HUD-registered broker. Equal Housing Opportunity.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className={`py-20 ${t.altSectionBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">From the basement to the open house, in three steps.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: 1, title: 'Learn the game.', body: 'Quick daily missions teach you what goes into a credit score, how a mortgage payment is built, and what lenders typically look at. You earn XP for learning, not for anything that happens to your actual credit.' },
              { n: 2, title: 'Find your starter home.', body: 'Browse homes under $300K in your state. Save the ones you like.' },
              { n: 3, title: 'Talk to the pros, on your terms.', body: "When you're ready, ask to be connected with the listing agent for a home you pick. You choose who to talk to. Licensed agents and lenders give the professional advice, and we're not one of them." },
            ].map((s) => (
              <div key={s.n} className="text-center">
                <div className={`w-16 h-16 ${t.gradient} text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4`}>{s.n}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-gray-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Credit Game */}
      <section id="credit-game" className={`py-20 ${t.sectionBg} scroll-mt-4`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Duolingo energy. Zero credit risk.</h2>
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                Your level goes up when you learn something, not when your score moves. The game uses a <strong>practice score</strong>, a pretend number that reacts to the choices you make in the game, so you can see how things like on-time payments or high balances tend to affect a score without risking your real one.
              </p>
              <div className={`border-l-4 ${t.accentBorder} bg-white/85 p-4 rounded mb-8 text-gray-700`}>
                Your practice score is not your real credit score. We never ask for your SSN, never pull your credit, and never report anything to any bureau. You can get your real reports free at{' '}
                <a href="https://www.annualcreditreport.com" className="underline" target="_blank" rel="noopener noreferrer">AnnualCreditReport.com</a>.
              </div>
              <Link href="/auth/signup" className={`inline-block ${t.gradient} text-white px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition`}>
                Start Level 1, Free
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className={`${t.gradient} text-white rounded-xl p-6 mb-6`}>
                <p className="text-sm opacity-90 mb-2">Sample missions</p>
                <div className="text-3xl font-bold">Level 1</div>
                <p className="text-sm opacity-90 mt-1">Practice score only. Not your real credit.</p>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'Budget Boss', desc: 'Build a sample monthly budget', xp: '+50 XP' },
                  { title: 'Payment Basics', desc: "What's in a mortgage payment?", xp: '+30 XP' },
                  { title: 'Report Reader', desc: 'Spot the 5 sections of a sample credit report', xp: '+20 XP' },
                  { title: 'Down Payment Math', desc: '3.5% vs 10% on a $200K home', xp: '+40 XP' },
                ].map((m) => (
                  <div key={m.title} className={`bg-gray-50 border-l-4 ${t.accentBorder} p-4 rounded`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900">{m.title}</p>
                        <p className="text-sm text-gray-600">{m.desc}</p>
                      </div>
                      <span className={`${t.gradient} text-white px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap`}>{m.xp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Straight Talk */}
      <section className={`py-20 ${t.altSectionBg}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">What we do, and what we don&apos;t.</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Award className={`w-6 h-6 ${t.accentText}`} /> We do</h3>
              <ul className="space-y-3 text-gray-700">
                {[
                  'Teach credit and homebuying basics for free',
                  'Show homes under $300K from public and agent sources',
                  'Connect you with a listing agent if you ask',
                  'Keep the game free',
                ].map((x) => (
                  <li key={x} className="flex gap-3"><Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />{x}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Shield className={`w-6 h-6 ${t.accentText}`} /> We don&apos;t</h3>
              <ul className="space-y-3 text-gray-700">
                {[
                  'Report anything to credit bureaus',
                  'Pull, check, or change your credit',
                  'Dispute items on your credit report',
                  'Promise a score, an approval, or a move-out date',
                  'Give financial, legal, or tax advice',
                  'Sell your contact info',
                ].map((x) => (
                  <li key={x} className="flex gap-3"><XIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Note */}
      <section className="py-20 bg-gray-950 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-black mb-6">I graduated in 2008. You know what happened next.</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            I did what I was told: college, loans, the whole thing. Then the economy fell apart and a lot of us moved back home with a degree and a balance. Nobody taught me how credit, mortgages, or ownership worked. I built {t.name} to be the thing I wish I&apos;d had at 22: honest, a little funny, and free to start.
          </p>
          <p className="text-gray-400 italic mb-6">Ryan Metzgar, founder, Baltimore</p>
          <Link href={t.about} className="font-semibold underline hover:text-gray-300">Read the full story →</Link>
        </div>
      </section>

      {/* For Agents */}
      <section id="agents" className={`py-20 ${t.sectionBg} scroll-mt-4`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Have a home under $300K? Put it in front of first-time buyers.</h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Founding rate: <strong>$29 per home for 90 days.</strong> List it with your brokerage and the official listing link. Buyers who ask about your home come straight to you.
          </p>
          <AgentsCTA theme={theme} />
          <p className="text-gray-600 text-xs mt-4">
            Listing fee is a flat advertising fee. It&apos;s not contingent on leads, showings, or closings. No guarantee of inquiries or sales. Listings must comply with fair housing law.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className={`${t.gradient} text-white py-20`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to get out of the basement?</h2>
          <p className={`text-xl ${t.ctaSubText} mb-10 max-w-2xl mx-auto`}>
            Play the free credit game and get first dibs on new homes in your area.
          </p>
          <Link href="/auth/signup" className={`inline-block bg-white ${t.primaryBtnText} px-10 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transition transform hover:-translate-y-1`}>
            Join Free
          </Link>
          <p className={`${t.ctaSubText} mt-6 text-sm`}>
            We never sell your info. <Link href="/privacy" className="underline">Privacy Policy</Link>
          </p>
        </div>
      </section>

      <SiteFooter theme={theme} />
    </div>
  )
}
