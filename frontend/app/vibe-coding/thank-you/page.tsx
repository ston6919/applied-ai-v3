export default function VibeCodingThankYouPage() {
  return (
    <div className="py-8 md:py-16">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-56">
        <div className="max-w-3xl mx-auto relative overflow-hidden rounded-3xl border border-gray-200 bg-white/90 shadow-xl p-6 md:p-10">
          <div className="pointer-events-none absolute -top-24 -left-20 h-56 w-56 rounded-full bg-indigo-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-20 h-56 w-56 rounded-full bg-pink-200/40 blur-3xl" />

          <div className="relative z-10 text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold gradient-text text-soft-shadow">
              You&apos;re all set
            </h1>
            <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">
              Thank you for joining
            </p>
            <p className="text-gray-700 text-sm md:text-base max-w-2xl mx-auto">
              Huge move. You&apos;re now inside a group that is building real AI systems, saving serious time, and turning those systems into real business results.
            </p>
            <p className="text-gray-700 text-sm md:text-base max-w-2xl mx-auto">
              Your payment is confirmed. Keep an eye on your inbox for two emails with next steps.
            </p>
          </div>

          <div className="relative z-10 mt-8 grid gap-4 md:grid-cols-2">
            <div className="card border border-indigo-100 bg-indigo-50/60 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600 mb-2">
                Email 1
              </p>
              <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                Course access account setup
              </h2>
              <p className="text-sm md:text-base text-gray-700">
                You&apos;ll get an email to create your account so you can log in and access the course immediately.
              </p>
            </div>

            <div className="card border border-pink-100 bg-pink-50/60 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600 mb-2">
                Email 2
              </p>
              <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                Mastermind access details
              </h2>
              <p className="text-sm md:text-base text-gray-700">
                You&apos;ll receive a second email with everything you need to get access to the mastermind.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-6 card bg-primary-50/70 border-primary-100 text-left">
            <p className="text-sm md:text-base text-gray-700">
              If you don&apos;t see both emails within 10-15 minutes, check spam and promotions first.
            </p>
            <p className="text-sm md:text-base text-gray-700 mt-2">
              Need help? Email{' '}
              <a href="mailto:matt@matt-penny.com" className="underline font-medium">
                matt@matt-penny.com
              </a>{' '}
              and we&apos;ll sort it quickly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
