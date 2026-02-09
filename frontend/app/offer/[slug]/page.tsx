import Link from 'next/link'
import Image from 'next/image'
import { StickyBuyButton } from '../../../components/StickyBuyButton'

type OfferPageProps = {
  params: { slug: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}

type Resource = {
  id: string
  name: string
  label: string
  miniHeadline: string
  description: string
  bullets: string[]
  bestFor: string
  value: string
}

const resources: Resource[] = [
  {
    id: 'automation-ai-power-pack',
    name: 'The Automation & AI Power Pack',
    label: '17 Premium n8n Business Workflows',
    miniHeadline: '17 Premium n8n Business Workflows',
    description:
      'Stop building from scratch and start scaling. These workflows are designed to quietly run key parts of your business so you spend less time wiring tools together and more time making decisions.',
    bullets: [
      'Install proven automations instead of losing weeks designing from zero.',
      'Standardise how data moves between your tools so nothing falls through the cracks.',
      'Create a repeatable "automation stack" you can roll out across offers and clients.',
    ],
    bestFor: 'Founders, operators, and consultants who want leverage without hiring a developer.',
    value: '$349',
  },
  {
    id: 'business-building-mcp-master-flow',
    name: 'Business MCP Builder Workshop',
    label: 'Build a reusable MCP for your tools',
    miniHeadline: 'The Business Building MCP Master-Flow',
    description:
      'A focused workshop that shows you how to build a Model Context Protocol (MCP) layer in front of the tools your business already uses—CRMs, helpdesks, docs, analytics, and more—so AI can talk to them in a consistent way.',
    bullets: [
      'Map the core tools your business relies on and turn them into MCP-capable endpoints.',
      'Create a single MCP you can reuse across AI chats, copilots, and agents instead of wiring each one from scratch.',
      'Learn a repeatable pattern for adding new tools to your MCP as your stack evolves.',
    ],
    bestFor: 'Operators and builders who want one clean way to connect AI to all their tools.',
    value: '$199',
  },
  {
    id: 'claude-code-skills-workbook',
    name: 'The Claude Code Skills Workbook',
    label: '13 Claude Code skills',
    miniHeadline: '13 Claude Code Skills To Save 13+ Hours / Week',
    description:
      'This workbook walks you through specific ways to brief Claude so it behaves like a focused teammate, not a vague brainstorming partner—across technical and creative work.',
    bullets: [
      'Turn recurring tasks into repeatable "skills" Claude can follow every time.',
      'Reduce back-and-forth by giving Claude clearer structure and constraints.',
      "Pull more value out of the tools you're already paying for, without extra headcount.",
    ],
    bestFor: 'Anyone who wants to get reliable, consistent output from Claude instead of one-off "lucky" results.',
    value: '$149',
  },
  {
    id: 'truth-in-time-audit',
    name: 'The "Truth-in-Time" Audit & Process',
    label: 'Time + energy audit template',
    miniHeadline: 'Discover where your time actually goes—not where you think it does',
    description:
      "You can't automate what you don't understand. This audit gives you a clear picture of how your week is really spent so you can prioritise the highest-ROI automations first.",
    bullets: [
      'See exactly which tasks are quietly draining your time and energy.',
      'Spot patterns that make great candidates for automation or delegation.',
      'Make automation decisions based on data, not gut feel or social media trends.',
    ],
    bestFor: "Owners and operators whose calendars are full but can't pinpoint why they're always behind.",
    value: '$99',
  },
  {
    id: 'business-context-walkthrough',
    name: 'The Business Context Walkthrough',
    label: 'Turn your business into AI-ready context',
    miniHeadline: 'The Business Context Builder',
    description:
      'Generic answers in, generic answers out. This walkthrough helps you pull the important details about your offers, customers, pricing, and processes out of your head and into a format AI can actually use.',
    bullets: [
      'Capture the key facts and nuances that make your business different.',
      'Feed AI better context so its suggestions fit your real-world constraints.',
      'Stop rewriting the same background info every time you open a new chat.',
    ],
    bestFor: "Anyone who's tired of \"one-size-fits-all\" suggestions that ignore how their business actually runs.",
    value: '$159',
  },
  {
    id: 'seven-deadly-automation-sins',
    name: 'The 7 Deadly Automation Sins',
    label: 'Implementation mistakes to avoid',
    miniHeadline: 'Avoid the mistakes that quietly kill automation ROI',
    description:
      "Most automation projects fail for the same handful of reasons. This guide shows you how to dodge those traps so you don't spend months reworking broken systems.",
    bullets: [
      'Avoid fragile automations that break the moment something changes.',
      'Stop over-automating low-value tasks while critical work stays manual.',
      'Build ownership and documentation so your systems survive team changes.',
    ],
    bestFor: 'Teams who want to build durable, low-maintenance automations from day one.',
    value: '$249',
  },
  {
    id: 'four-step-ai-application-framework',
    name: 'The 4-Step AI Application Framework',
    label: 'Clarity on what to automate next',
    miniHeadline: 'The 4 Step AI Framework For AI Transformation',
    description:
      "Instead of guessing based on what's trendy, this framework walks you through a structured way to find, rank, and roll out high-impact AI projects.",
    bullets: [
      'Map out where AI can plug into your operations in a meaningful way.',
      'Prioritise opportunities by impact and effort instead of noise.',
      'Turn big, vague ideas into a concrete implementation roadmap.',
    ],
    bestFor: 'Leaders who want a calm, disciplined way to roll AI into the business.',
    value: '$399',
  },
  {
    id: 'real-world-ai-case-studies',
    name: 'Real-World AI Case Studies: Time & Revenue',
    label: '9 detailed case studies',
    miniHeadline: '9 Real Examples of AI Turning Time Into Revenue',
    description:
      "See what this looks like in practice. These case studies walk through real implementations, numbers, and lessons so you can copy what works and avoid what doesn't.",
    bullets: [
      'Understand how different types of businesses are applying AI right now.',
      'Borrow specific patterns instead of starting from a blank page.',
      'Learn from both the wins and the mistakes so you move faster.',
    ],
    bestFor: 'Anyone who wants proof this works in the real world, not just in theory.',
    value: '$239',
  },
]

const totalValueLabel = 'Total Value: $1,842'

function HeroCTA() {
  return (
    <div className="flex flex-col gap-3 items-start w-full">
      <Link
        href="/api/checkout"
        prefetch={false}
        className="btn-gradient btn-shimmer text-base md:text-lg px-6 py-3 rounded-full w-full text-center"
      >
        Get the complete system for $17
      </Link>
      <p className="text-sm text-gray-700">
        One-time payment. Instant access. Backed by a 100% money-back guarantee.
      </p>
    </div>
  )
}

function PrimaryCTA() {
  return (
    <div className="flex flex-col gap-3 items-center w-full">
      <Link
        href="/api/checkout"
        prefetch={false}
        className="bg-white text-base md:text-lg px-6 py-3 rounded-full w-full text-center font-semibold shadow-md hover:shadow-lg transition-shadow"
      >
        <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
          Get the complete system for $17
        </span>
      </Link>
      <p className="text-sm text-white text-center">
        One-time payment. Instant access. Backed by a 100% money-back guarantee.
      </p>
    </div>
  )
}

export default function OfferPage({ params, searchParams }: OfferPageProps) {
  const { slug } = params
  const nameParam = searchParams?.name
  const firstName = Array.isArray(nameParam) ? nameParam[0] : nameParam

  const headline = 'Turn AI from theory into a working system in your business this month.'
  const subheadline = 'Get all of my most impactful resources in one bundle.'

  return (
    <div className="py-8 md:py-20">
      <StickyBuyButton />
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-56">
        {/* Context bar */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50/70 px-4 py-2 text-sm font-medium text-primary-800 shadow-sm">
            <span className="inline-flex h-2 w-2 min-h-2 min-w-2 flex-shrink-0 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              Your resources are on their way to your inbox. But I have something special for you...
            </span>
          </div>
        </div>

        {/* Hero section */}
        <section className="flex flex-col gap-10 md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-center">
          {/* Text content wrapper for desktop */}
          <div className="text-center md:text-left flex flex-col gap-6">
            {firstName && (
              <p className="mb-2 text-sm text-gray-600">{`Hi ${firstName},`}</p>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-5 gradient-text text-soft-shadow">
              {headline}
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-4">
              {subheadline}
            </p>
            <p className="text-sm md:text-base mb-6 text-white font-medium border-l-4 border-red-600 pl-4 py-2 bg-red-500 rounded-r md:text-left text-center md:inline-block">
              This is a one-time deal. You will not see this offer again.
            </p>

            {/* Hero image / bundle preview - appears here on mobile */}
            <div className="relative md:hidden">
              <div className="blob bg-indigo-300 w-40 h-40 -top-10 -left-6" />
              <div className="blob bg-pink-300 w-40 h-40 -bottom-6 -right-8" />
              <div className="relative card overflow-hidden shadow-xl border border-gray-200/80">
                <Image
                  src="/ALL.png"
                  alt="Automation & AI Power Pack"
                  width={608}
                  height={400}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            </div>

            <p className="text-base md:text-lg font-semibold text-primary-700 mb-6">
              {totalValueLabel}
            </p>
            <HeroCTA />
          </div>

          {/* Hero image / bundle preview - desktop only */}
          <div className="hidden md:block relative">
            <div className="blob bg-indigo-300 w-40 h-40 -top-10 -left-6" />
            <div className="blob bg-pink-300 w-40 h-40 -bottom-6 -right-8" />
            <div className="relative card overflow-hidden shadow-xl border border-gray-200/80">
              <Image
                src="/ALL.png"
                alt="Automation & AI Power Pack"
                width={608}
                height={400}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>
        </section>

        {/* Deep-dive alternating sections */}
        <section className="mt-16 md:mt-20 space-y-12 md:space-y-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center md:text-left">
            What&apos;s Inside
          </h2>
          {resources.map((resource, index) => {
            const imageOnLeft = index % 2 === 0
            return (
              <article
                key={resource.id}
                className="grid gap-8 md:grid-cols-2 items-center"
              >
                <div
                  className={
                    imageOnLeft
                      ? 'order-1'
                      : 'order-1 md:order-2'
                  }
                >
                  {resource.id === 'automation-ai-power-pack' ? (
                    <div className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-6 shadow-md">
                      <Image
                        src="/n8n-workflows-box.png"
                        alt="17 Premium n8n Business Workflows"
                        width={608}
                        height={279}
                        className="w-full h-auto object-contain"
                        priority={index === 0}
                      />
                    </div>
                  ) : resource.id === 'business-building-mcp-master-flow' ? (
                    <div className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-6 shadow-md">
                      <Image
                        src="/mcp-master-flow-box.png"
                        alt="The Business Building MCP Master-Flow"
                        width={608}
                        height={279}
                        className="w-full h-auto object-contain"
                        priority={index === 1}
                      />
                    </div>
                  ) : resource.id === 'claude-code-skills-workbook' ? (
                    <div className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-6 shadow-md">
                      <Image
                        src="/claude-code-skills-workbook-box.png"
                        alt="The Claude Code Skills Workbook"
                        width={608}
                        height={279}
                        className="w-full h-auto object-contain"
                        priority={index === 2}
                      />
                    </div>
                  ) : resource.id === 'four-step-ai-application-framework' ? (
                    <div className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-6 shadow-md">
                      <Image
                        src="/four-step-ai-framework-box.png"
                        alt="The 4-Step AI Application Framework"
                        width={608}
                        height={279}
                        className="w-full h-auto object-contain"
                        priority={index === 6}
                      />
                    </div>
                  ) : resource.id === 'seven-deadly-automation-sins' ? (
                    <div className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-6 shadow-md">
                      <Image
                        src="/seven-deadly-automation-sins-box.png"
                        alt="The 7 Deadly Automation Sins"
                        width={608}
                        height={279}
                        className="w-full h-auto object-contain"
                        priority={index === 5}
                      />
                    </div>
                  ) : resource.id === 'business-context-walkthrough' ? (
                    <div className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-6 shadow-md">
                      <Image
                        src="/Untitled design (86).png"
                        alt="The Business Context Builder"
                        width={608}
                        height={279}
                        className="w-full h-auto object-contain"
                        priority={index === 4}
                      />
                    </div>
                  ) : resource.id === 'truth-in-time-audit' ? (
                    <div className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-6 shadow-md">
                      <Image
                        src="/Truth in time.png"
                        alt="The Truth-in-Time Audit & Process"
                        width={608}
                        height={279}
                        className="w-full h-auto object-contain"
                        priority={index === 3}
                      />
                    </div>
                  ) : resource.id === 'real-world-ai-case-studies' ? (
                    <div className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-6 shadow-md">
                      <Image
                        src="/9 case studies.png"
                        alt="Real-World AI Case Studies: Time & Revenue"
                        width={608}
                        height={279}
                        className="w-full h-auto object-contain"
                        priority={index === 7}
                      />
                    </div>
                  ) : (
                    <div className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-6 shadow-md">
                      <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-sky-200 opacity-40 blur-3xl" />
                      <div className="absolute -right-12 -bottom-12 h-36 w-36 rounded-full bg-pink-200 opacity-40 blur-3xl" />
                      <div className="relative z-10 space-y-3">
                        <p className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-primary-700 border border-primary-100 shadow-sm">
                          {resource.label}
                        </p>
                        <div className="space-y-2">
                          <div className="rounded-xl bg-white/80 border border-gray-100 p-3 shadow-sm">
                            <p className="text-xs font-semibold text-gray-700 mb-1">
                              Snapshot
                            </p>
                            <p className="text-sm text-gray-700">
                              {resource.description}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                            <div className="rounded-lg bg-white/80 border border-gray-100 p-3">
                              <p className="font-semibold mb-1">Best for</p>
                              <p>{resource.bestFor}</p>
                            </div>
                            <div className="rounded-lg bg-white/80 border border-gray-100 p-3">
                              <p className="font-semibold mb-1">Value</p>
                              <p>{resource.value}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={
                    imageOnLeft
                      ? 'order-2 md:pl-8'
                      : 'order-2 md:order-1 md:pr-8'
                  }
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600 mb-2">
                    {resource.label}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {resource.miniHeadline}
                  </h3>
                  <ul className="space-y-2 text-gray-700 mb-4">
                    {resource.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 font-semibold text-primary-700 border border-primary-100">
                      Value: {resource.value}
                    </span>
                    <span className="text-gray-600">
                      Best for: {resource.bestFor}
                    </span>
                  </div>
                </div>
              </article>
            )
          })}
        </section>

        {/* How it all fits together */}
        <section className="mt-16 md:mt-20">
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              How these pieces work together in your business
            </h2>
            <p className="text-gray-700 mb-3">
              You&apos;re not getting a random pile of downloads. You&apos;re getting a system that helps you decide where AI belongs, teach it about your business, connect it to your tools, and then learn from what happens.
            </p>
            <p className="text-gray-700">
              Use the audit and framework to choose the right work, the context walkthrough and MCP flow to wire AI into your data, the workflows and workbook to run it day-to-day, and the sins + case studies to steer clear of costly mistakes.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="card relative overflow-hidden">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600 mb-1">
                Step 1
              </p>
              <h3 className="font-semibold text-gray-900 mb-1">
                Find the real bottlenecks
              </h3>
              <p className="text-sm text-gray-700">
                Use the Truth-in-Time Audit and 4-Step AI Application Framework to see where AI can actually free up hours and protect revenue.
              </p>
            </div>
            <div className="card relative overflow-hidden">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600 mb-1">
                Step 2
              </p>
              <h3 className="font-semibold text-gray-900 mb-1">
                Teach AI your world
              </h3>
              <p className="text-sm text-gray-700">
                Use the Business Context Walkthrough so your AI tools understand your offers, customers, pricing, and constraints.
              </p>
            </div>
            <div className="card relative overflow-hidden">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600 mb-1">
                Step 3
              </p>
              <h3 className="font-semibold text-gray-900 mb-1">
                Connect tools &amp; data
              </h3>
              <p className="text-sm text-gray-700">
                Use the Business Building MCP Master-Flow and the 17 workflows to plug AI into your stack so work actually moves without you.
              </p>
            </div>
            <div className="card relative overflow-hidden">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600 mb-1">
                Step 4
              </p>
              <h3 className="font-semibold text-gray-900 mb-1">
                Avoid mistakes &amp; scale
              </h3>
              <p className="text-sm text-gray-700">
                Use the 7 Deadly Automation Sins and the case studies to stay out of the common traps while you roll automations out across the business.
              </p>
            </div>
          </div>
        </section>


        {/* CTA section */}
        <section id="get-access" className="mt-16 md:mt-20">
          <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 px-6 py-10 md:px-10 md:py-12 shadow-xl">
            <div className="particle-container">
              <div className="particle particle-1" />
              <div className="particle particle-2" />
              <div className="particle particle-3" />
              <div className="particle particle-4" />
              <div className="particle particle-5" />
              <div className="particle particle-6" />
              <div className="particle particle-7" />
              <div className="particle particle-8" />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                Start installing AI systems, not just trying new tools.
              </h2>
              <p className="text-white/90 mb-6 text-sm md:text-base max-w-2xl mx-auto">
                Get the full Automation &amp; AI Power Pack plus all the strategy and implementation guides so you can plug AI into your business in a way that actually sticks, without a big spend.
              </p>
              <PrimaryCTA />
              <p className="mt-4 text-xs text-white/80 max-w-xl mx-auto">
                Note: this is a one-time offer that only appears immediately after you request your resources. If you close this page, you won&apos;t see this $17 bundle again.
              </p>
            </div>
          </div>
        </section>
        
        {/* Money-back guarantee */}
        <section className="mt-16 md:mt-20 pb-4">
          <div className="card bg-emerald-50 border-emerald-200">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              100% money-back guarantee
            </h2>
            <p className="text-sm md:text-base text-gray-700 mb-3">
              If you pick up this bundle for $17 and feel it wasn&apos;t worth it, just send a quick email within 30 days and we&apos;ll refund you in full.
            </p>
            <p className="text-sm md:text-base text-gray-700">
              No long forms, no hoops to jump through. If it doesn&apos;t help you move closer to a calmer, AI-supported business, you get your money back.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

