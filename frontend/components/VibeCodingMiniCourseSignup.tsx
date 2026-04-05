'use client'

import { useState } from 'react'
import Image from 'next/image'

const DAYS = [
  { label: 'Day 1', text: 'Understand the vibe coding revolution' },
  {
    label: 'Day 2',
    text: 'Hands-on: you’ll build a simple, real application from scratch with free tools',
  },
  {
    label: 'Day 3',
    text: 'Learn the framework for building more complex applications',
  },
] as const

export default function VibeCodingMiniCourseSignup() {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!firstName.trim()) {
      setError('Please enter your first name')
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/vibe-coding-mini-course/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName.trim(),
          email: email.trim(),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.message || 'Sign-up failed')
      }
      setSuccess(true)
      setFirstName('')
      setEmail('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 pt-4 pb-10 md:py-16">
      <div className="max-w-xl mx-auto">
        <header className="text-center mb-5 md:mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold gradient-text text-soft-shadow mb-2 md:mb-4">
            Free 3-Day Vibe Coding Mini Course
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-gray-800 max-w-xl mx-auto leading-snug">
            Learn to turn your ideas into real applications
          </p>
        </header>

        <div className="card bg-white/90 backdrop-blur border border-gray-200/80 shadow-lg">
          {success ? (
            <div className="text-center py-4">
              <p className="text-lg font-semibold text-gray-900 mb-2">You&apos;re in!</p>
              <p className="text-gray-600">
                Check your inbox for the mini course. If you don&apos;t see it, peek in spam or promotions.
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-700 font-medium mb-4">What you&apos;ll get:</p>
              <ul className="space-y-3 mb-8">
                {DAYS.map(({ label, text }) => (
                  <li key={label} className="flex gap-3 text-gray-700">
                    <span className="shrink-0 font-semibold text-primary-600 w-14">{label}</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="vcmc-first-name" className="block text-sm font-medium text-gray-700 mb-2">
                    First name
                  </label>
                  <input
                    id="vcmc-first-name"
                    type="text"
                    name="first_name"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/90 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label htmlFor="vcmc-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="vcmc-email"
                    type="email"
                    name="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/90 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-gradient btn-shimmer rounded-full px-6 py-3 text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing up…' : 'Sign up free'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </>
          )}
        </div>

        <footer className="mt-12 md:mt-14 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden relative z-10 border border-gray-200/80 shadow-md bg-white">
            <Image
              src="/profile.png"
              alt="Matt Penny"
              width={88}
              height={88}
              className="object-cover w-full h-full"
              priority
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                const next = e.currentTarget.nextElementSibling as HTMLElement | null
                if (next) next.style.display = 'flex'
              }}
            />
            <div
              className="w-full h-full bg-gray-200 items-center justify-center absolute inset-0 hidden"
              aria-hidden
            >
              <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-lg font-semibold text-gray-900">By Matt Penny</p>
          <p className="mt-1 text-sm text-gray-600">12+ years of developer experience</p>
        </footer>
      </div>
    </div>
  )
}
