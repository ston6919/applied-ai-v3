import Link from 'next/link'
import EmailCapture from '../components/EmailCapture'

export default function Home() {
  return (
    <div>
      {/* Hero: Applied AI for real business outcomes */}
      <section className="relative overflow-hidden py-24">
        {/* Light theme background and subtle rings */}
        <div className="hero-bg" />
        <div className="hero-rings" />

        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 gradient-text">
                Apply AI to grow profit — not just run cool demos
              </h1>
              <p className="text-xl md:text-2xl mb-6 max-w-2xl text-gray-700">
                We turn models and tools into measurable outcomes: more revenue, lower costs,
                faster operations. Learn what to use, when to use it, and how to implement it the
                right way in your business.
              </p>
              <p className="text-base md:text-lg text-gray-600 max-w-xl">
                Enter your email to get our 4‑step framework for driving revenue and sales with AI.
              </p>
            </div>
            <div className="w-full max-w-xl md:ml-auto">
              <EmailCapture />
            </div>
          </div>
        </div>
      </section>

      {/* Quick links grid (2x2) */}
      <section className="relative py-12">
        <div className="container mx-auto px-8 md:px-16 lg:px-32 xl:px-48 2xl:px-64">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card: News */}
            <Link href="/news" className="group relative block overflow-hidden rounded-2xl h-40 md:h-48 shadow-lg ring-1 ring-gray-200/60 bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-500 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl" aria-label="Go to News">
              <div className="absolute inset-0 opacity-20 group-hover:opacity-25 transition-opacity bg-[radial-gradient(600px_300px_at_20%_20%,#fff,transparent)]" />
              <div className="absolute top-5 left-5 text-left">
                <h3 className="text-2xl font-bold text-white drop-shadow-sm">News</h3>
                <p className="text-white/90 max-w-xs">Stay on top of releases, pricing, and quick takes on what to try next.</p>
              </div>
              <div className="absolute bottom-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white shadow-sm transition-transform duration-300 group-hover:translate-x-1">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M13 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Card: Tools */}
            <Link href="/tools" className="group relative block overflow-hidden rounded-2xl h-40 md:h-48 shadow-lg ring-1 ring-gray-200/60 bg-gradient-to-br from-emerald-400 via-teal-500 to-green-600 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl" aria-label="Go to Tools">
              <div className="absolute inset-0 opacity-20 group-hover:opacity-25 transition-opacity bg-[radial-gradient(600px_300px_at_20%_20%,#fff,transparent)]" />
              <div className="absolute top-5 left-5 text-left">
                <h3 className="text-2xl font-bold text-white drop-shadow-sm">Tools</h3>
                <p className="text-white/90 max-w-xs">Curated tools matched to outcomes so you can adopt value in hours.</p>
              </div>
              <div className="absolute bottom-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white shadow-sm transition-transform duration-300 group-hover:translate-x-1">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M13 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Card: Templates */}
            <Link href="/automations" className="group relative block overflow-hidden rounded-2xl h-40 md:h-48 shadow-lg ring-1 ring-gray-200/60 bg-gradient-to-br from-rose-400 via-pink-500 to-orange-500 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl" aria-label="Go to Templates">
              <div className="absolute inset-0 opacity-20 group-hover:opacity-25 transition-opacity bg-[radial-gradient(600px_300px_at_20%_20%,#fff,transparent)]" />
              <div className="absolute top-5 left-5 text-left">
                <h3 className="text-2xl font-bold text-white drop-shadow-sm">Templates</h3>
                <p className="text-white/90 max-w-xs">Ready-made automation blueprints you can tailor to your workflow.</p>
              </div>
              <div className="absolute bottom-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white shadow-sm transition-transform duration-300 group-hover:translate-x-1">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M13 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Card: Mastermind */}
            <a href="https://www.skool.com/applied-ai-mastermind-9612" target="_blank" rel="noopener noreferrer" className="group relative block overflow-hidden rounded-2xl h-40 md:h-48 shadow-lg ring-1 ring-gray-200/60 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl" aria-label="Open Mastermind in new tab">
              <div className="absolute inset-0 opacity-20 group-hover:opacity-25 transition-opacity bg-[radial-gradient(600px_300px_at_20%_20%,#fff,transparent)]" />
              <div className="absolute top-5 left-5 text-left">
                <h3 className="text-2xl font-bold text-white drop-shadow-sm">Mastermind</h3>
                <p className="text-white/90 max-w-xs">Join peers shipping real AI, get support, shortcuts, and accountability.</p>
              </div>
              <div className="absolute bottom-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white shadow-sm transition-transform duration-300 group-hover:translate-x-1">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M13 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Section: Why staying current matters (News) */}
      <section className="relative overflow-hidden py-16">
        {/* Background gradient + blobs */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-rose-50" />
        <div className="blob w-64 h-64 bg-blue-300 left-[-2rem] top-[-2rem]" />
        <div className="blob w-64 h-64 bg-pink-300 right-[-2rem] bottom-[-2rem]" />

        <div className="container mx-auto px-4 grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why the latest AI news matters</h2>
            <p className="text-lg text-gray-700 mb-4">
              Models, features, and policies change weekly. Knowing what just
              shipped helps you move first — choosing faster, cheaper, or more
              capable options before competitors do.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              We track releases and distill what matters so you can act quickly
              without drowning in noise.
            </p>
            <Link href="/news" className="btn-primary">Read the latest news</Link>
          </div>
          <div className="card backdrop-blur bg-white/80 shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:ring-1 hover:ring-primary-200/60 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-2">What you’ll find</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Major model updates and pricing changes</li>
              <li>Capabilities that unlock new use‑cases</li>
              <li>Quick takes on what’s worth trying now</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section: Tools as the easiest on‑ramp */}
      <section className="relative overflow-hidden py-16">
        {/* Background gradient + blobs */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-emerald-50 via-white to-indigo-50" />
        <div className="blob w-64 h-64 bg-emerald-300 left-[10%] top-[-3rem]" />
        <div className="blob w-64 h-64 bg-indigo-300 right-[-2rem] bottom-[-3rem]" />

        <div className="container mx-auto px-4 grid gap-6 md:grid-cols-2 md:items-center">
          <div className="order-2 md:order-1 card backdrop-blur bg-white/80 shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:ring-1 hover:ring-primary-200/60 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-2">Start simple</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>No engineering required to get value</li>
              <li>Quick wins: content, analysis, research, assistants</li>
              <li>Playbooks for common business workflows</li>
            </ul>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Great tools = fastest path to impact</h2>
            <p className="text-lg text-gray-700 mb-4">
              The easiest way to use AI today is through proven tools. We curate
              and explain what to use for specific outcomes so you can adopt in
              hours, not months.
            </p>
            <Link href="/tools" className="btn-primary">Browse recommended tools</Link>
          </div>
        </div>
      </section>

      {/* Section: When you need bespoke (Templates/Automations) */}
      <section className="relative overflow-hidden py-16">
        {/* Background gradient + blobs */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-50 via-white to-sky-50" />
        <div className="blob w-64 h-64 bg-amber-300 left-[-2rem] bottom-[-2rem]" />
        <div className="blob w-64 h-64 bg-sky-300 right-[-2rem] top-[-2rem]" />

        <div className="container mx-auto px-4 grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">When tools can’t — build bespoke</h2>
            <p className="text-lg text-gray-700 mb-4">
              Off‑the‑shelf tools don’t fit every workflow. That’s when a small,
              focused automation or app makes the difference.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Access hundreds of templates you can tweak (997+ and growing) to
              match your process — faster than building from scratch.
            </p>
            <Link href="/automations" className="btn-primary">See automation templates</Link>
          </div>
          <div className="card backdrop-blur bg-white/80 shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:ring-1 hover:ring-primary-200/60 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-2">Templates help you…</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Standardize repeatable AI workflows</li>
              <li>Customize logic, prompts, and data sources</li>
              <li>Ship solutions without heavy engineering</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section: Mastermind CTA */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Get support, shortcuts, and accountability</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
            Join the Applied AI Mastermind for curated news, live support, and a
            community implementing AI in real businesses. Learn what works — and
            copy proven playbooks.
          </p>
          <a
            href="https://www.skool.com/applied-ai-mastermind-9612"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary btn-shimmer"
          >
            Join the Mastermind
          </a>
        </div>
      </section>
    </div>
  )
}
