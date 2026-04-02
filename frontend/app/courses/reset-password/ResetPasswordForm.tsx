'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

function getTokenFromHash() {
  if (typeof window === 'undefined') return { accessToken: '', refreshToken: '', recoveryType: '' }
  const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash
  const params = new URLSearchParams(hash)
  return {
    accessToken: params.get('access_token') || '',
    refreshToken: params.get('refresh_token') || '',
    recoveryType: params.get('type') || '',
  }
}

export default function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [accessToken, setAccessToken] = useState('')
  const [refreshToken, setRefreshToken] = useState('')
  const [recoveryType, setRecoveryType] = useState('')

  useEffect(() => {
    const tokens = getTokenFromHash()
    setAccessToken(tokens.accessToken)
    setRefreshToken(tokens.refreshToken)
    setRecoveryType(tokens.recoveryType)
  }, [])

  const hasValidResetToken = useMemo(() => {
    return Boolean(accessToken && refreshToken)
  }, [accessToken, refreshToken])

  const isInitialPasswordFlow = recoveryType === 'signup' || recoveryType === 'invite'

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (!hasValidResetToken) {
      setError('Reset link is invalid or expired. Please request a new one.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    const response = await fetch('/api/courses/update-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken,
        refreshToken,
        password,
      }),
    })
    setSubmitting(false)

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}))
      setError(payload.error || 'Unable to reset password')
      return
    }

    setSuccess('Password updated. Redirecting to login...')
    setTimeout(() => {
      router.push('/courses/login')
      router.refresh()
    }, 1200)
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-md mx-auto rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          {isInitialPasswordFlow ? 'Set Your Password' : 'Reset Password'}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {isInitialPasswordFlow
            ? 'Create your password to finish setting up your courses account.'
            : 'Set a new password for your courses account.'}
        </p>

        {!hasValidResetToken ? (
          <div className="mt-6 rounded-md border border-amber-300 bg-amber-50 p-4">
            <p className="text-sm text-amber-800">This reset link is invalid or expired.</p>
            <Link href="/courses/login" className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline">
              Back to login
            </Link>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                New password
              </label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm new password
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {success ? <p className="text-sm text-green-700">{success}</p> : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {submitting ? 'Updating...' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

