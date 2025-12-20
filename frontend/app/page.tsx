import Link from 'next/link'
import EmailCapture from '../components/EmailCapture'

export default function Home() {
  return (
    <div>
      {/* Hero: Applied AI for real business outcomes */}
      <section className="relative overflow-hidden pt-16 md:pt-32">
        {/* Background moved to Root layout */}

        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-16 gradient-text text-soft-shadow">
              Build a Smarter, Faster Business With AI
            </h1>
            <p className="text-xl md:text-2xl mb-6 text-gray-700">
              The world of AI is filled with BS and hype. 
            </p>
            <p className="text-xl md:text-2xl mb-6 text-gray-700">
              We cut through the noise and curate the best tools, templates, and insights to help you implement AI in your business in an impactful way.
            </p>
          </div>
        </div>
      </section>

      {/* Quick links grid (2x2) */}
      <section className="relative py-20">
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
            <Link href="/templates" className="group relative block overflow-hidden rounded-2xl h-40 md:h-48 shadow-lg ring-1 ring-gray-200/60 bg-gradient-to-br from-rose-400 via-pink-500 to-orange-500 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl" aria-label="Go to Templates">
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

      {/* Section: Mastermind CTA */}
      <section className="py-20 relative">
        <div className="absolute inset-0 opacity-60" style={{backgroundImage: 'linear-gradient(90deg, #6366f1, #8b5cf6 30%, #ec4899 65%, #f59e0b)'}}></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 text-soft-shadow">Join The Applied AI Mastermind</h2>
          <p className="text-lg text-white mb-8 max-w-3xl mx-auto">
            Get access to 2000+ proven templates, curated news, live support, and a
            community implementing AI in real businesses. Learn what works — and
            copy proven playbooks.
          </p>
          <a
            href="https://www.skool.com/applied-ai-mastermind-9612"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Join the Mastermind
          </a>
        </div>
      </section>
    </div>
  )
}
