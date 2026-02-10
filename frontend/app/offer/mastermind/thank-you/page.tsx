import Link from 'next/link'

export default function MastermindThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-56">
        <div className="max-w-2xl mx-auto card bg-white/90 border border-gray-200 text-center space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">
              Applied AI Mastermind
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Thank you for joining the mastermind
            </h1>
            <p className="text-gray-700 text-sm md:text-base">
              You&apos;re in. Welcome to a community of people using AI to actually move the needle in their businesses.
            </p>
          </div>

          <div className="text-left space-y-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">Here&apos;s what happens next</h2>
            <ul className="space-y-2 text-sm md:text-base text-gray-700">
              <li>✔ Check your email inbox for an invitation to the Applied AI Mastermind community.</li>
              <li>✔ If you don&apos;t see it in a few minutes, check your spam or promotions folder just in case.</li>
              <li>✔ Click the invite link in that email to create or log into your community account.</li>
              <li>✔ Once you&apos;re in, introduce yourself and share what you&apos;re working on.</li>
              <li>✔ Start exploring the courses, templates, and call replays inside the community space.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-xs md:text-sm text-gray-500">
              If you don&apos;t receive your invite email within 10–15 minutes, reply to your purchase receipt or contact support and we&apos;ll help you
              get access.
            </p>
            <Link
              href="/offer/mastermind"
              className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm md:text-base font-semibold btn-gradient btn-shimmer"
            >
              Back to mastermind page
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

