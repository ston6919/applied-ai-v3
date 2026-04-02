'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setInfo(null)
    setSubmitting(true)

    const response = await fetch('/api/courses/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })

    setSubmitting(false)

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}))
      setError(payload.error || 'Unable to sign in')
      return
    }

    router.push('/courses')
    router.refresh()
  }

  async function handleResetPassword() {
    setError(null)
    setInfo(null)
    if (!email) {
      setError('Enter your email first, then click reset password.')
      return
    }

    setResetLoading(true)
    const response = await fetch('/api/courses/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setResetLoading(false)

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}))
      setError(payload.error || 'Unable to send reset email')
      return
    }

    setInfo('Password reset email sent. Check your inbox.')
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-md mx-auto rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Courses Login</h1>
        <p className="mt-2 text-sm text-gray-600">Sign in to access your courses.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {info ? <p className="text-sm text-green-700">{info}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>

          <button
            type="button"
            onClick={handleResetPassword}
            disabled={resetLoading}
            className="text-sm text-indigo-700 underline underline-offset-2 hover:text-indigo-800 disabled:opacity-60"
          >
            {resetLoading ? 'Sending reset email...' : 'Forgot password?'}
          </button>
        </form>
      </div>
    </div>
  )
}

