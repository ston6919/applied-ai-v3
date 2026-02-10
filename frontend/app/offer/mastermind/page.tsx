'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const CTA_URL = 'https://www.skool.com/applied-ai-mastermind-9612'

function StickyMastermindButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return
      setVisible(window.scrollY > 300)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-4 right-4 z-40 pointer-events-none">
      <Link
        href="/api/checkout-mastermind"
        prefetch={false}
        className="pointer-events-auto bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 text-white text-sm md:text-base px-4 md:px-5 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
      >
        <span>Join the mastermind – $37/mo</span>
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  )
}

function JoinMastermindButton({ variant = 'primary' }: { variant?: 'primary' | 'secondary' }) {
  const baseClasses =
    'inline-flex items-center justify-center rounded-full px-8 py-3 text-base md:text-lg font-semibold transition-colors'

  if (variant === 'secondary') {
    return (
      <Link
        href={CTA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} border border-white/60 bg-white/10 text-white shadow-sm backdrop-blur hover:bg-white/20`}
      >
        Join Applied AI Mastermind
      </Link>
    )
  }

  return (
    <Link
      href={CTA_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} btn-gradient btn-shimmer w-full md:w-auto text-center`}
    >
      Join Applied AI Mastermind
    </Link>
  )
}

function VideoSection() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [overlayVisible, setOverlayVisible] = useState(true)

  const handleEnableSound = () => {
    const iframe = iframeRef.current
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: 'unMute',
          args: []
        }),
        '*'
      )
    }
    setOverlayVisible(false)
  }

  return (
    <section className="mt-4 md:mt-6">
      <div className="card bg-white/80 border border-gray-200 shadow-md">
        <div className="relative w-full overflow-hidden rounded-2xl bg-black aspect-video">
          {overlayVisible && (
            <button
              type="button"
              onClick={handleEnableSound}
              className="absolute bottom-4 right-4 z-10 rounded-full bg-white/95 px-6 py-3 text-sm md:text-base font-semibold text-gray-900 shadow-lg hover:bg-white"
            >
              Tap to turn sound on
            </button>
          )}
          {overlayVisible && (
            <div className="absolute inset-0 z-0 cursor-pointer" />
          )}
          <iframe
            ref={iframeRef}
            src="https://www.youtube.com/embed/e5yQur-L7iA?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&enablejsapi=1"
            title="Applied AI Mastermind overview"
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="p-4 md:p-5 flex flex-col items-center">
          <div className="text-center mb-3">
            <div className="flex items-baseline justify-center gap-3">
              <span className="text-base md:text-lg text-gray-500 line-through">Normally $99/mo</span>
              <span className="text-3xl md:text-4xl font-extrabold text-gray-900">$37</span>
              <span className="text-sm text-gray-600">per month</span>
            </div>
            <p className="mt-2 text-sm text-gray-700">
              Join now to lock in this price <span className="font-semibold">forever</span>. As more content is added, the public price will rise—but
              yours won&apos;t.
            </p>
          </div>
          <Link
            href="/api/checkout-mastermind"
            prefetch={false}
            className="btn-gradient btn-shimmer text-base md:text-lg px-8 py-3 rounded-full text-center font-semibold disabled:opacity-60"
          >
            Join Applied AI Mastermind for $37/month
          </Link>
          <p className="mt-2 text-xs text-gray-600 text-center">
            14-day risk-free guarantee. If it&apos;s not for you, get a full refund.
          </p>
        </div>
      </div>
    </section>
  )
}

export default function MastermindSalesPage() {
  return (
    <div className="py-8 md:py-16">
      <StickyMastermindButton />
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-56">
        {/* Context / urgency bar */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50/80 px-4 py-2 text-sm font-medium text-primary-800 shadow-sm">
            <span className="inline-flex h-2 w-2 min-h-2 min-w-2 flex-shrink-0 rounded-full bg-red-400 animate-pulse" />
            <span>Price increases when 4 more people join – lock in your price now</span>
          </div>
        </div>

        {/* Hero + video (single column) */}
        <section className="flex flex-col gap-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold gradient-text text-soft-shadow text-center">
            Stop drowning in AI tools.
            <br className="hidden md:block" />
            Start using AI to actually grow your business.
          </h1>

          {/* Video directly under the headline */}
          <VideoSection />

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.18em] text-primary-600 font-semibold">
                Founding member pricing • Updated: 10th Feb 2026
              </p>
            </div>
          </div>
        </section>

        {/* The gap & positioning – before & after */}
        <section className="mt-16 md:mt-20">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card bg-red-50/80 border border-red-100 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-500">
                Before Applied AI Mastermind
              </p>
              <ul className="space-y-2 text-gray-700 text-sm md:text-base">
                <li>✖ Drowning in AI tools and tutorials, not sure what to focus on.</li>
                <li>✖ Half-finished automations that break or never get used.</li>
                <li>✖ Hours lost on YouTube, X, and blogs trying to piece things together.</li>
                <li>✖ Unsure which ideas will actually move revenue or save real time.</li>
              </ul>
            </div>
            <div className="card bg-green-50/80 border border-green-100 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">
                After Applied AI Mastermind
              </p>
              <ul className="space-y-2 text-gray-700 text-sm md:text-base">
                <li>✔ A short, clear list of AI projects that matter for your business.</li>
                <li>✔ Simple, stable automations quietly running in the background.</li>
                <li>✔ A repeatable way to turn ideas into flows using proven templates.</li>
                <li>✔ Confidence you&apos;re not falling behind as AI moves forward.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* What’s inside */}
        <section className="mt-16 md:mt-20">
          <div className="max-w-3xl mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              What&apos;s inside the Applied AI Mastermind
            </h2>
            <p className="text-gray-700">
              You&apos;re not getting another course to sit on a digital shelf. You&apos;re getting a complete system that covers fundamentals, automation,
              strategy, and real-world execution—plus the templates and support to move fast.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="card border border-gray-200">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600 mb-2">Pillar 1</p>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">AI Fundamentals</h3>
              <p className="text-sm md:text-base text-gray-700 mb-3">
                The essential building blocks so you actually understand what you&apos;re working with—not just which buttons to press.
              </p>
              <ul className="space-y-1.5 text-sm text-gray-700">
                <li>✔ How modern LLMs work (in plain English).</li>
                <li>✔ Using data properly, including vector databases and RAG systems.</li>
                <li>✔ APIs, webhooks, and HTTP requests explained for non-developers.</li>
              </ul>
            </div>

            <div className="card border border-gray-200">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600 mb-2">Pillar 2</p>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Automation &amp; Agents with n8n</h3>
              <p className="text-sm md:text-base text-gray-700 mb-3">
                Go from zero to building production-ready AI automations and agents that actually run in your business.
              </p>
              <ul className="space-y-1.5 text-sm text-gray-700">
                <li>✔ n8n basics, nodes, and best practices.</li>
                <li>✔ Building AI agents and adding AI chat to any website.</li>
                <li>✔ Over-the-shoulder walkthroughs of real automations.</li>
              </ul>
            </div>

            <div className="card border border-gray-200">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600 mb-2">Pillar 3</p>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">AI Applied to Business (Strategy)</h3>
              <p className="text-sm md:text-base text-gray-700 mb-3">
                The crucial strategy piece: how AI actually creates business value, not just cool demos.
              </p>
              <ul className="space-y-1.5 text-sm text-gray-700">
                <li>✔ The 4 key outcomes AI can drive in a business.</li>
                <li>✔ Where AI really increases customer acquisition, LTV, and efficiency.</li>
                <li>✔ How to choose what to automate, and when manual is better.</li>
                <li>✔ Lessons from analysing 148 businesses and how they&apos;re using AI.</li>
              </ul>
            </div>

            <div className="card border border-gray-200">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600 mb-2">Pillar 4</p>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Your First $100k (for AI service providers)</h3>
              <p className="text-sm md:text-base text-gray-700 mb-3">
                If you&apos;re selling AI services or building an AI agency, this shows you how to turn your skills into revenue.
              </p>
              <ul className="space-y-1.5 text-sm text-gray-700">
                <li>✔ Step-by-step path to your first $100k in service revenue.</li>
                <li>✔ Positioning, pricing, and packaging your offers.</li>
                <li>✔ How to find and close the right kind of clients.</li>
              </ul>
            </div>

            <div className="card border border-gray-200">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600 mb-2">Templates &amp; Resources</p>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">2000+ n8n Templates Library</h3>
              <p className="text-sm md:text-base text-gray-700 mb-3">
                Search, download, and start using proven automations in seconds instead of designing flows from a blank canvas.
              </p>
              <ul className="space-y-1.5 text-sm text-gray-700">
                <li>✔ Premium, ready-to-use n8n workflows for real business problems.</li>
                <li>✔ Save weeks of build time by starting from a working template.</li>
                <li>✔ Learn patterns that you can adapt across other tools and clients.</li>
              </ul>
            </div>

            <div className="card border border-gray-200">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600 mb-2">Community &amp; Support</p>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                Live Calls, Daily AI News &amp; Resource Library
              </h3>
              <p className="text-sm md:text-base text-gray-700 mb-3">
                Stay up to date and never get stuck on your own.
              </p>
              <ul className="space-y-1.5 text-sm text-gray-700">
                <li>✔ Regular live calls with Matt and other members.</li>
                <li>✔ Help with technical problems, strategy questions, and real use cases.</li>
                <li>✔ Daily curated AI news so you only see what matters.</li>
                <li>✔ Up-to-date resources on AI video, avatars, images, Notebook LM, advanced n8n workflows, and more.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Benefits & outcomes */}
        <section className="mt-16 md:mt-20">
          <div className="card bg-primary-50/80 border-primary-100">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">What this really gives you</h2>
            <p className="text-gray-700 mb-4">
              At the end of the day, the mastermind isn&apos;t about learning more tools. It&apos;s about building a calmer, more profitable business that uses AI
              in the right places.
            </p>
            <ul className="grid gap-2 text-sm md:text-base text-gray-800 md:grid-cols-2">
              <li>✔ Clarity on where AI fits into your specific business.</li>
              <li>✔ Confidence that you&apos;re building the right automations, not just more of them.</li>
              <li>✔ Systems that save time without becoming a full-time job to maintain.</li>
              <li>✔ A library of proven workflows so you never start from zero.</li>
              <li>✔ A community and mentor you can lean on when you get stuck.</li>
              <li>✔ A long-term edge as AI becomes the standard in your industry.</li>
            </ul>
          </div>
        </section>

        {/* FAQ (moved above final CTA) */}
        <section className="mt-16 md:mt-20">
          <div className="w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
            <div className="space-y-4">
              <div className="card border border-gray-200">
                <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                  How much time do I need each week?
                </h3>
                <p className="text-sm text-gray-700">
                  Most members spend 1–3 hours per week going through lessons, joining calls, or implementing what they&apos;ve learned. You can go faster or
                  slower—the content and replays are there when you need them.
                </p>
              </div>
              <div className="card border border-gray-200">
                <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                  What if I&apos;m completely new to AI and tech?
                </h3>
                <p className="text-sm text-gray-700">
                  That&apos;s totally fine. The fundamentals and walkthroughs are designed to be simple and practical. You&apos;ll see everything explained in plain
                  language with real examples.
                </p>
              </div>
              <div className="card border border-gray-200">
                <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                  Is this right for me if I&apos;m already using AI tools?
                </h3>
                <p className="text-sm text-gray-700">
                  Yes—especially if you&apos;re comfortable with tools but not sure how to apply them strategically. You&apos;ll learn which projects to focus on and
                  how to build systems that last.
                </p>
              </div>
              <div className="card border border-gray-200">
                <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1">Can I cancel any time?</h3>
                <p className="text-sm text-gray-700">
                  Yes. You&apos;re not locked into a long contract. Stay for as long as it&apos;s valuable to you. And if you&apos;re not happy in the first 14 days, you
                  can get a full refund.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Guarantee section above final CTA */}
        <section className="mt-12 md:mt-16">
          <div className="card bg-white/80 border border-green-200">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">14-day risk-free guarantee</h2>
            <p className="text-gray-700 mb-3">
              Join Applied AI Mastermind and explore the lessons, templates, and community for a full 14 days. If you feel it&apos;s not the right fit for you,
              just send a message and you&apos;ll get a full refund—no questions asked.
            </p>
            <p className="text-gray-700 text-sm md:text-base">
              This isn&apos;t about locking you into another subscription. It&apos;s about giving you the space to see how much faster and clearer your AI projects can
              become when you&apos;re not figuring everything out alone.
            </p>
          </div>
        </section>

        {/* Pricing & final CTA */}
        <section className="mt-16 md:mt-20">
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
            <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
                Lock in your rate and future-proof your business with AI.
              </h2>
              <p className="text-white/90 mb-4 text-sm md:text-base max-w-2xl mx-auto">
                Join Applied AI Mastermind today for <span className="font-semibold">$37/month</span> (normally $99+/month). As more content and support are
                added, the price will rise—but your rate is locked in for as long as you stay.
              </p>
              <p className="text-white/90 mb-6 text-xs md:text-sm">
                Try it risk-free for 14 days. If you&apos;re not happy, simply let us know and you&apos;ll get a full refund—no questions asked.
              </p>
              <div className="flex flex-col items-center gap-3">
                <JoinMastermindButton variant="secondary" />
                <p className="text-[11px] md:text-xs text-white/80 max-w-md">
                  The AI genie is out of the bottle. Six months from now, you&apos;ll wish you started today. Lock in your rate and I&apos;ll see you inside the
                  mastermind.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16 md:mt-20 pb-6 md:pb-10" />
      </div>
    </div>
  )
}

