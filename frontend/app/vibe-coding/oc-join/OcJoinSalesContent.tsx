import { OcJoinFaqAccordion, type OcJoinFaqItem } from './OcJoinFaqAccordion'

const eyebrow = 'text-xs font-bold uppercase tracking-[0.12em] text-violet-600'
const sectionTitle = 'text-2xl md:text-3xl font-bold text-gray-900 tracking-tight'
const body = 'text-gray-600 leading-relaxed'
const cardBase =
  'rounded-2xl border border-violet-100 bg-white/90 p-5 md:p-6 shadow-sm transition-shadow hover:shadow-md'

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className={`${body} list-disc space-y-2 pl-5`}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

const transitionBoxClass =
  'flex flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white/90 px-4 py-6 text-center shadow-sm md:min-h-[5.5rem]'

const HOW_HELP_DETAIL_PAIRS = [
  {
    before: 'Great ideas, but no way to build them',
    after: 'Bring ideas to life in a weekend',
  },
  {
    before: 'Running a manual, messy business',
    after: 'An automated business powered by AI',
  },
  {
    before: 'Paying developers heavily or abandoning ideas',
    after: 'Build what your business needs without hiring a team',
  },
  {
    before: 'Best ideas live in your head or on sticky notes',
    after: 'Ship products and new income streams from scratch',
  },
  {
    before: 'Tech feels like something that happens to other people',
    after: 'Technology becomes a superpower, not a wall',
  },
] as const

const OC_JOIN_FAQ_ITEMS: OcJoinFaqItem[] = [
  {
    id: 'technical',
    question: 'What if I am not technical enough?',
    lead: 'This comes up a lot, and it makes complete sense to wonder. Here is the honest answer.',
    answer:
      'This course was built specifically for people who have zero technical background. You never write a single line of code, not in lesson one, not ever. You describe what you want in plain English, the same way you would explain it to a developer. The AI does the technical work. Your job is to think clearly about what you want to build. That is it. If you can send a detailed email, you can do this.',
  },
  {
    id: 'ai-wrong',
    question: 'What if the AI gets it wrong?',
    lead: 'It will, sometimes. That is perfectly okay. Here is why it does not matter as much as you think.',
    answer:
      'You do not need to read code to know something is wrong. You just need to test the output. Does the button work? Does the data save? Is this what I asked for? You are checking outcomes, not debugging syntax. When something is off, you describe the gap in plain English: "The name is not saving when I click submit. Fix it." The AI corrects it. You test again. That loop is your entire skill set, and anyone can do it from day one.',
  },
  {
    id: 'time',
    question: 'What if I do not have time?',
    lead: 'Life is busy. It is a completely valid concern. Here is what the reality looks like.',
    answer:
      'The first module gets you building something real (a working, functional app) in your very first sitting. There is no lengthy setup, no background reading required. It is hands-on from lesson one. More importantly, the time you spend learning this pays back immediately. Every tool you build saves hours. Every automation you set up runs while you sleep. If you can carve out a weekend to get started, you will quickly find this creates time. It does not eat it.',
  },
  {
    id: 'calm-down',
    question: 'What if I want to wait until things calm down?',
    lead: 'Completely understandable. Life does not stop for courses. Here is why that is actually fine, and why today still matters.',
    answer:
      'You do not have to start now, and that is kind of the point. This course goes entirely at your pace, in your own time. There are no deadlines, no live sessions to miss, no pressure to sprint through it. Come back to it in a month, three months, six months: it will be here. Because we add new material regularly, it will always reflect the latest tools and techniques. You will not return to something outdated. But here is the one thing that will not wait: the price. Today is the lowest it will ever be. Every update and new module we add moves the price up. The content stays fresh forever. This price does not.',
  },
  {
    id: 'price',
    question: 'What if it is not worth the price?',
    lead: 'It is a fair thing to ask. And here is the thing: you do not have to take my word for it.',
    answer:
      'Worth remembering: $379 is only available for this three-day window. After that it goes to $700, and the price will keep rising as new content is added. So relative to what it will cost later, right now is the best deal this course will be at for a while. But if you still have doubts, that is exactly what the 14-day guarantee is for. Get inside. Watch the first modules. Start building. If within 14 days you do not see the value, if you genuinely do not feel like this is going to change what is possible for you, just send us one email and we will refund every penny. No awkward questions, no hoops. The risk is entirely on our side. Yours is zero.',
  },
]

export default function OcJoinSalesContent({
  ctaUrl,
  ctaLabel,
}: {
  ctaUrl: string
  ctaLabel: string
}) {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-14 md:gap-20 pb-8">
      {/* The opportunity */}
      <section className="flex flex-col gap-4" aria-labelledby="opportunity-heading">
        <p className={eyebrow}>The opportunity</p>
        <h2 id="opportunity-heading" className={sectionTitle}>
          We are at a <span className="text-violet-600">once-in-a-generation</span> moment
        </h2>
        <p className={`${body} text-lg`}>
          The world runs on software. Building it has never been this accessible. Most people have
          not caught on yet, which is exactly where your advantage comes from.
        </p>
        <div className="grid gap-4 md:grid-cols-3 mt-2">
          <div
            className={`${cardBase} flex min-h-[9rem] md:min-h-[10.5rem] items-center justify-center text-center px-4`}
          >
            <h3 className="font-bold text-gray-900 text-lg md:text-xl text-balance">
              Software runs everything
            </h3>
          </div>
          <div
            className={`${cardBase} flex min-h-[9rem] md:min-h-[10.5rem] items-center justify-center text-center px-4`}
          >
            <h3 className="font-bold text-gray-900 text-lg md:text-xl text-balance">
              It&apos;s easier than ever to create
            </h3>
          </div>
          <div
            className={`${cardBase} flex min-h-[9rem] md:min-h-[10.5rem] items-center justify-center text-center px-4`}
          >
            <h3 className="font-bold text-gray-900 text-lg md:text-xl text-balance">
              Get ahead of everyone else
            </h3>
          </div>
        </div>
      </section>

      {/* Bridge: before / after */}
      <section
        className="flex flex-col gap-4"
        aria-labelledby="how-i-help-eyebrow how-i-help-heading"
      >
        <p id="how-i-help-eyebrow" className={eyebrow}>
          The shift
        </p>
        <h2 id="how-i-help-heading" className={sectionTitle}>
          How I want to help you
        </h2>
        <div className="flex flex-col gap-4">
          <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-end md:gap-4">
            <p className="text-center text-sm font-semibold text-red-700">Before</p>
            <span className="inline-block w-10 shrink-0" aria-hidden />
            <p className="text-center text-sm font-semibold text-emerald-700">After</p>
          </div>
          <div className="flex flex-col md:gap-4">
            {HOW_HELP_DETAIL_PAIRS.map((pair, index) => (
              <div
                key={pair.before}
                className={`flex w-full flex-col items-stretch gap-3 md:flex-row md:items-center md:gap-4 ${
                  index > 0
                    ? 'mt-8 border-t border-gray-300 pt-8 md:mt-0 md:border-t-0 md:pt-0'
                    : ''
                }`}
              >
                <div className={transitionBoxClass}>
                  <p className="text-base font-bold text-gray-900 text-balance md:text-lg">{pair.before}</p>
                </div>
                <div
                  className="flex shrink-0 items-center justify-center text-2xl font-bold text-violet-600 md:w-10 md:text-3xl"
                  aria-hidden
                >
                  <span className="hidden md:inline">→</span>
                  <span className="md:hidden">↓</span>
                </div>
                <div className={transitionBoxClass}>
                  <p className="text-base font-bold text-gray-900 text-balance md:text-lg">{pair.after}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course intro */}
      <section className="flex flex-col gap-4 text-center" aria-labelledby="course-intro-heading">
        <p className={eyebrow}>Introducing...</p>
        <h2 id="course-intro-heading" className={`${sectionTitle} max-w-3xl mx-auto`}>
          Vibe Coding <span className="gradient-text">Mastery</span> Course
        </h2>
        <p className={`${body} text-lg max-w-2xl mx-auto`}>
          Step-by-step training from zero to shipping real software. No traditional coding background
          required. You describe outcomes; AI handles implementation while you learn the builder
          mindset.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <span className="rounded-full bg-violet-100 text-violet-800 px-4 py-1.5 text-sm font-semibold">
            10+ hours of training
          </span>
          <span className="rounded-full bg-emerald-100 text-emerald-800 px-4 py-1.5 text-sm font-semibold">
            Full technical support
          </span>
          <span className="rounded-full bg-amber-100 text-amber-900 px-4 py-1.5 text-sm font-semibold">
            Lifetime updates
          </span>
        </div>
      </section>

      {/* Transformation */}
      <section className="flex flex-col gap-4" aria-labelledby="transformation-heading">
        <p className={eyebrow}>The transformation</p>
        <h2 id="transformation-heading" className={sectionTitle}>
          From ideas you cannot build to a builder who can create{' '}
          <span className="text-violet-600">almost anything</span>
        </h2>
        <p className={`${body} text-lg`}>
          This is not a single trick. It is identity-level change: what you can do for your business,
          your income, your career, and your side projects.
        </p>
        <div className="grid gap-4 md:grid-cols-2 mt-2">
          <div className={cardBase}>
            <h3 className="font-bold text-gray-900 mb-2">In your business</h3>
            <p className={body}>
              Dashboards, client portals, automations, and lead tools that make you faster and more
              impressive, without a dev hire.
            </p>
          </div>
          <div className={cardBase}>
            <h3 className="font-bold text-gray-900 mb-2">A new income stream</h3>
            <p className={body}>
              Sell tools, niche products, or SaaS, or offer vibe coding as a service to other owners.
            </p>
          </div>
          <div className={cardBase}>
            <h3 className="font-bold text-gray-900 mb-2">At work</h3>
            <p className={body}>
              Be the person who ships internal tools, fixes workflows, and solves problems others
              cannot. That is career-defining.
            </p>
          </div>
          <div className={cardBase}>
            <h3 className="font-bold text-gray-900 mb-2">Anything you imagine</h3>
            <p className={body}>
              Apps, extensions, personal tools, learning products. If you can specify it, you can work
              toward it with this stack.
            </p>
          </div>
        </div>
      </section>

      {/* Module overview */}
      <section className="flex flex-col gap-6" aria-labelledby="modules-heading">
        <p className={eyebrow}>What is inside</p>
        <h2 id="modules-heading" className={sectionTitle}>
          Five modules that stack on each other
        </h2>
        <ol className="space-y-4">
          {[
            {
              n: '1',
              title: 'Baby Steps: your first builds',
              value: '$97',
              bullets: [
                'Learn prompting basics and build simple, working apps with confidence',
                'Build real tools from scratch with the simplest path. No prior experience required',
                'Deploy to the web so anyone can use what you make',
                'Use templates to move faster and build confidence',
                'Hands-on with Gemini Canvas and v0',
              ],
            },
            {
              n: '2',
              title: 'Lovable: time audit tool',
              value: '$197',
              bullets: [
                'Build a working time audit app that shows where hours go and where AI can help',
                'Master Lovable for fast idea-to-app work',
                'Diagnose and fix bugs without getting stuck',
                'How databases store and retrieve data',
                'Add authentication so people securely access their own data',
              ],
            },
            {
              n: '3',
              title: 'Cursor: business dashboard tool',
              value: '$497',
              bullets: [
                'Spec and plan complex projects before the first prompt',
                'Cursor IDE for production-grade software',
                'Integrate real third-party APIs (Stripe, Google, Supabase, and more)',
                'Deep debugging: find, fix, and prevent issues',
                'Host on Vercel with a real domain',
                'Google Antigravity for fast, strong UI work',
                'Stripe so your app can take payments',
              ],
            },
            {
              n: '4',
              title: 'Claude Code: Chrome extension',
              value: '$297',
              bullets: [
                'Claude Code as your core AI dev workflow',
                'Extensions that interact with sites you use',
                'A professional debugging loop with AI as pair programmer',
                'Browser tools that fit everyday work',
              ],
            },
            {
              n: '5',
              title: 'Theory: key concepts',
              value: '$297',
              bullets: [
                'Engineering ideas that cut errors and improve security: the gap between hobby projects and serious builders',
                'Hosting and deployment: how apps go live and stay running',
                'GitHub and version control: track changes and roll back safely',
                'Branching: try features without breaking what works',
                'Security: protect user data from the ground up',
                'Prompting and planning: meta-skills that speed everything else up',
              ],
            },
          ].map((m) => (
            <li
              key={m.n}
              className="flex gap-4 rounded-2xl border border-gray-200 bg-white/90 p-4 md:p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white font-bold">
                {m.n}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-gray-900">
                  {m.title}{' '}
                  <span className="text-violet-600 font-semibold text-sm whitespace-nowrap">
                    Value {m.value}
                  </span>
                </h3>
                <div className="mt-3">
                  <BulletList items={m.bullets} />
                </div>
              </div>
            </li>
          ))}
          <li className="flex gap-4 rounded-2xl border border-gray-200 bg-white/90 p-4 md:p-5">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white text-xl font-bold leading-none"
              aria-hidden
            >
              +
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-gray-900">
                More content is always being added{' '}
                <span className="text-violet-600 font-semibold text-sm whitespace-nowrap">
                  Included
                </span>
              </h3>
              <div className="mt-3">
                <BulletList
                  items={[
                    'New lessons, updates, and walkthroughs land as tools and workflows evolve',
                    'You keep access to everything new we ship on top of the five core modules',
                    'Treat it as a living library: the path you have today grows on a steady cadence',
                  ]}
                />
              </div>
            </div>
          </li>
        </ol>
      </section>

      {/* Bonuses (part of the stack in the source deck) */}
      <section className="flex flex-col gap-6" aria-labelledby="bonuses-heading">
        <p className={eyebrow}>Bonuses included</p>
        <h2 id="bonuses-heading" className={sectionTitle}>
          Extra courses and membership
        </h2>

        <article className={cardBase}>
          <h3 className="font-bold text-gray-900">
            AI fundamentals <span className="text-violet-600 text-sm font-semibold">· Value $197</span>
          </h3>
          <BulletList
            items={[
              'What LLMs are and how they work',
              'API calls and HTTP in plain terms',
              'JSON and why it matters',
              'Databases for beginners',
              'RAG and vector databases, simply explained',
              'How data flows between systems',
            ]}
          />
        </article>

        <article className={cardBase}>
          <h3 className="font-bold text-gray-900">
            Applying AI to business{' '}
            <span className="text-violet-600 text-sm font-semibold">· Value $497</span>
          </h3>
          <BulletList
            items={[
              'Four-step framework to save money and grow revenue',
              'Where AI actually belongs in your business',
              'Mistakes that can hurt a business, and how to avoid them',
              '“Time saving” traps that waste more than they return',
            ]}
          />
        </article>

        <article className={cardBase}>
          <h3 className="font-bold text-gray-900">
            n8n agents and automations{' '}
            <span className="text-violet-600 text-sm font-semibold">· Value $397</span>
          </h3>
          <BulletList
            items={[
              'Linear automations that run while you sleep',
              'Agents for multi-step work',
              'Workflows that claw back hours',
              'Connect tools in one place',
              'Move toward a business that runs more of itself',
            ]}
          />
        </article>

        <article className={cardBase}>
          <h3 className="font-bold text-gray-900">
            Applied AI Mastermind membership (3 months){' '}
            <span className="text-violet-600 text-sm font-semibold">· Value $111</span>
          </h3>
          <BulletList
            items={[
              'Direct access for guidance',
              'Technical support until it works',
              'Community of builders on the same path',
              'Updates on tools and news',
              'Accountability and shared wins',
              'Extra guides and resources',
            ]}
          />
        </article>
      </section>

      {/* Pricing */}
      <section className="flex flex-col gap-6" aria-labelledby="pricing-heading">
        <p className={eyebrow}>The investment</p>
        <h2 id="pricing-heading" className={sectionTitle}>
          Everything you get, and what it is worth
        </h2>
        <div className={`${cardBase} overflow-hidden p-0`}>
          <div className="divide-y divide-gray-100">
            {[
              ['Baby Steps module', '$97'],
              ['Lovable module', '$197'],
              ['Business dashboards module', '$497'],
              ['Chrome extensions module', '$297'],
              ['Theory module', '$297'],
              ['Full technical support', '$497'],
            ].map(([label, price]) => (
              <div key={label} className="flex justify-between gap-4 px-5 py-3 text-sm md:text-base">
                <span className="text-gray-700">{label}</span>
                <span className="font-semibold text-gray-900 tabular-nums">{price}</span>
              </div>
            ))}
            <div className="bg-violet-50/80 px-5 py-2 text-xs font-bold uppercase tracking-wider text-violet-800">
              Bonuses included
            </div>
            {[
              ['AI fundamentals course', '$197'],
              ['Applying AI to business course', '$497'],
              ['n8n agents and automations course', '$397'],
              ['Applied AI Mastermind membership (3 months)', '$111'],
            ].map(([label, price]) => (
              <div key={label} className="flex justify-between gap-4 px-5 py-3 text-sm md:text-base">
                <span className="text-gray-700">{label}</span>
                <span className="font-semibold text-gray-900 tabular-nums">{price}</span>
              </div>
            ))}
            <div className="flex justify-between gap-4 bg-gray-900 px-5 py-4 text-white">
              <span className="font-bold">Total value</span>
              <span className="font-extrabold tabular-nums text-lg">$3,086</span>
            </div>
          </div>
        </div>

        <div className="text-center space-y-6">
          <p className={`${body} max-w-xl mx-auto`}>
            That is <strong className="text-gray-900">$3,086</strong> of training and support. Half
            would be <span className="line-through text-gray-400">$1,543</span>.{' '}
            <strong className="text-gray-900">It is not that.</strong>
          </p>
          <div className="mx-auto max-w-md">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
              Regular price
            </p>
            <p className="text-2xl md:text-3xl font-extrabold text-gray-900 tabular-nums">$700</p>
            <p className={`${body} text-xs md:text-sm mt-1.5`}>
              One-off · new content added regularly · yours to keep
            </p>
          </div>
          <div className="rounded-2xl border border-violet-200 bg-violet-50/60 px-6 py-8">
            <p className="mb-6 text-center text-sm font-bold uppercase tracking-[0.14em] text-violet-800 md:text-lg">
              Three-day action taker deal
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
              <div className="text-center">
                <p className="text-xs font-bold uppercase text-gray-600">When the 3 days end</p>
                <p className="text-3xl md:text-4xl font-extrabold text-gray-900 tabular-nums">$700</p>
                <p className={`${body} mt-1 text-xs`}>full price again</p>
              </div>
              <span className="text-2xl text-gray-400 hidden sm:inline" aria-hidden>
                →
              </span>
              <div className="text-center">
                <p className="text-xs font-bold uppercase text-violet-700">Next 3 days only</p>
                <p className="text-4xl md:text-5xl font-extrabold text-violet-600 tabular-nums">
                  $379
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gradient btn-shimmer inline-flex items-center justify-center rounded-full px-8 py-3 text-base md:text-lg font-semibold text-center"
              >
                {ctaLabel}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="flex flex-col gap-4" aria-labelledby="guarantee-heading">
        <p className={eyebrow}>Zero risk</p>
        <h2 id="guarantee-heading" className={sectionTitle}>
          Try it for <span className="text-violet-600">14 days</span>, completely risk free
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 items-start rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 mt-2">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">14-day 100% money-back guarantee</h3>
            <p className={`${body} mt-2`}>
              Explore everything inside. If it is not for you, one email gets every penny back. No
              awkward questions.
            </p>
          </div>
        </div>
        <p className={`${body} rounded-xl border-l-4 border-violet-400 bg-violet-50/60 px-5 py-4`}>
          The bigger risk is skipping this and, a year from now, wishing you had started while others
          pulled ahead.
        </p>
      </section>

      <OcJoinFaqAccordion items={OC_JOIN_FAQ_ITEMS} />

      <div className="flex flex-col items-center gap-4 pt-4 border-t border-gray-200">
        <p className="text-center text-gray-600 text-sm max-w-md">
          Ready when you are. Same checkout as the button above. One-off purchase; guarantee applies.
        </p>
        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gradient btn-shimmer inline-flex items-center justify-center rounded-full px-8 py-3 text-base md:text-lg font-semibold text-center"
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  )
}
