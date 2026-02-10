import Image from 'next/image'

export default function MastermindThankYouPage() {
  return (
    <div className="py-8 md:py-16">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-56">
        <div className="max-w-2xl mx-auto card bg-white/90 border border-gray-200 text-center space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">
              Applied AI Mastermind
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              You&apos;re in – here&apos;s how to get access
            </h1>
            <p className="text-gray-700 text-sm md:text-base">
              Amazing work. You&apos;ve just taken a real step towards using AI strategically in your business—not just collecting more tools.
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

            <div className="mt-4">
              <p className="text-xs md:text-sm text-gray-500 mb-2">
                The email will look like this – look for the invite from Skool and click &quot;Join now&quot; to get into the community:
              </p>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                <Image
                  src="/assets/Screenshot_2026-02-10_at_6.23.41_pm-54642c6c-9b67-4128-9e67-db6e14f03319.png"
                  alt="Example of the Applied AI Mastermind Skool invite email with a Join Now button"
                  width={1024}
                  height={499}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          <p className="text-xs md:text-sm text-gray-500">
            If you don&apos;t receive your invite email within 10–15 minutes, check spam and promotions, then email{' '}
            <a href="mailto:matt@matt-penny.com" className="underline">
              matt@matt-penny.com
            </a>{' '}
            and we&apos;ll help you get access.
          </p>
        </div>
      </div>
    </div>
  )
}

