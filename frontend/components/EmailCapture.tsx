'use client'

import { useState } from 'react'

export default function EmailCapture() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'hero' })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || 'Subscription failed')
      }
      setSuccess(true)
      setEmail('')
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="mt-8 card backdrop-blur bg-white/80 shadow-xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Your 4‑Step Revenue Framework</h3>
        <p className="text-gray-700 mb-4">Use this to prioritize and ship AI that actually moves the numbers.</p>
        <ol className="list-decimal pl-5 space-y-2 text-gray-700">
          <li>
            <span className="font-medium">Map Profit Levers:</span> Identify revenue drivers and top friction points across the funnel.
          </li>
          <li>
            <span className="font-medium">Pick High‑ROI Use‑Cases:</span> Score ideas by impact vs. effort and data availability.
          </li>
          <li>
            <span className="font-medium">Prototype Fast:</span> Start with proven tools/templates; ship a usable outcome in 1–2 weeks.
          </li>
          <li>
            <span className="font-medium">Measure & Scale:</span> Track KPIs, refine prompts/data, add guardrails, then automate.
          </li>
        </ol>
        <p className="text-sm text-gray-500 mt-4">We 7ll also send an email with this framework for your notes.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
      <div className="flex-1 min-w-[240px]">
        <label htmlFor="email" className="sr-only">Email</label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Enter your email to get the 4‑step framework"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/80 backdrop-blur shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn-primary px-6 py-3 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting…' : 'Get the Framework'}
      </button>
      {error && (
        <div className="w-full text-center text-sm text-red-600">{error}</div>
      )}
    </form>
  )
}











