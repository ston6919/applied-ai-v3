'use client'

import { useState, useEffect, useCallback } from 'react'

interface CCSkill {
  id: number
  name: string
  description: string | null
  path: string | null
  category: string | null
  downloads: number | null
  author: string | null
  version: string | null
  license: string | null
  keywords: string[] | null
  created_at: string | null
}

export default function CCSkillsPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [skills, setSkills] = useState<CCSkill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [passwordInput, setPasswordInput] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set())

  function toggleAccordion(id: string) {
    setOpenAccordions((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const categories = [...new Set(skills.map((s) => s.category ?? '').filter((c) => c !== ''))].sort()
  const hasUncategorized = skills.some((s) => s.category == null || s.category === '')
  const filteredSkills =
    selectedCategory === null
      ? skills
      : selectedCategory === '__uncategorized__'
        ? skills.filter((s) => s.category == null || s.category === '')
        : skills.filter((s) => s.category === selectedCategory)

  function installCommand(path: string | null): string | null {
    if (!path) return null
    return `npx claude-code-templates@latest --skill=${path} --yes`
  }

  async function copyInstallCommand(path: string | null, id: number) {
    const cmd = installCommand(path)
    if (!cmd) return
    try {
      await navigator.clipboard.writeText(cmd)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // ignore
    }
  }

  const fetchSkills = useCallback(async () => {
    setError(null)
    const res = await fetch('/api/cc-skills', { credentials: 'include' })
    if (res.status === 401) {
      setAuthenticated(false)
      setSkills([])
      return
    }
    if (!res.ok) {
      setError('Failed to load skills')
      setAuthenticated(false)
      return
    }
    const data = await res.json()
    setSkills(data.skills ?? [])
    setAuthenticated(true)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function check() {
      const res = await fetch('/api/cc-skills', { credentials: 'include' })
      if (cancelled) return
      if (res.status === 401) {
        setAuthenticated(false)
        setSkills([])
        setLoading(false)
        return
      }
      if (!res.ok) {
        setError('Failed to load skills')
        setLoading(false)
        return
      }
      const data = await res.json()
      setSkills(data.skills ?? [])
      setAuthenticated(true)
      setLoading(false)
    }
    check()
    return () => { cancelled = true }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setAuthError(null)
    setSubmitting(true)
    const res = await fetch('/api/cc-skills/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: passwordInput }),
      credentials: 'include',
    })
    setSubmitting(false)
    if (res.status === 401) {
      setAuthError('Invalid password')
      return
    }
    if (!res.ok) {
      setAuthError('Something went wrong')
      return
    }
    setAuthenticated(true)
    setPasswordInput('')
    await fetchSkills()
  }

  async function handleLogout() {
    await fetch('/api/cc-skills/logout', { method: 'POST', credentials: 'include' })
    setAuthenticated(false)
    setSkills([])
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-sm mx-auto mt-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Claude Code Skills</h1>
          <p className="text-gray-600 mb-6">Enter the password to view the skills list.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Password"
                autoComplete="current-password"
                disabled={submitting}
              />
            </div>
            {authError && (
              <p className="text-sm text-red-600">{authError}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {submitting ? 'Checking...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-4xl font-bold text-gray-900">
          Supercharge Your Workflows With {skills.length} Claude Code Skills
        </h1>
        <button
          type="button"
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Log out
        </button>
      </div>

      <div className="mb-8 space-y-2">
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => toggleAccordion('what')}
            className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            What are Claude Code Skills?
            <span
              className={`shrink-0 ml-2 transition-transform ${openAccordions.has('what') ? 'rotate-180' : ''}`}
              aria-hidden
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
          {openAccordions.has('what') && (
            <div className="px-4 pb-4 pt-0 border-t border-gray-100">
              <p className="text-gray-600 text-sm leading-relaxed">
                Claude Code Skills are small, reusable instructions that help Claude (and other AI coding assistants) do specific tasks better—like writing code in a certain style, using a particular framework, or following your project’s conventions. Each skill is a short guide the AI can read so it gives you more accurate, consistent results.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => toggleAccordion('install')}
            className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            How to install them
            <span
              className={`shrink-0 ml-2 transition-transform ${openAccordions.has('install') ? 'rotate-180' : ''}`}
              aria-hidden
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
          {openAccordions.has('install') && (
            <div className="px-4 pb-4 pt-0 border-t border-gray-100">
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Each skill has an <strong>Install Command</strong> in the table below. Click <strong>Copy</strong>, then run the command in Claude Code or in your terminal. If you use the terminal, run it from your project folder so the skill is installed in the right place. For example:
              </p>
              <blockquote className="pl-4 border-l-2 border-gray-300 text-gray-600 text-sm bg-gray-100/50 py-2 pr-3 rounded-r font-mono">
                npx claude-code-templates@latest --skill=video/remotion --yes
              </blockquote>
              <p className="text-gray-600 text-sm leading-relaxed mt-3">
                The command installs the skill into your project so your AI assistant can use it. You can also add skill files manually to a <code className="px-1 py-0.5 bg-gray-200 rounded text-xs">.claude/skills</code> folder if you prefer.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 bg-amber-50/50 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleAccordion('credit')}
            className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-gray-900 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            Credit &amp; disclaimer
            <span
              className={`shrink-0 ml-2 transition-transform ${openAccordions.has('credit') ? 'rotate-180' : ''}`}
              aria-hidden
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
          {openAccordions.has('credit') && (
            <div className="px-4 pb-4 pt-0 border-t border-amber-100 text-sm">
              <p className="text-gray-700">
                <strong>Credit:</strong> Skills catalog and data thanks to{' '}
                <a
                  href="https://github.com/davila7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline font-medium"
                >
                  davila7 on GitHub
                </a>
                .
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Security:</strong> Be wary of the security risks of downloading and using skills. Skills can run or influence code in your project—only use skills from sources you trust, and review what a skill does before installing it.
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="mb-4 text-red-600">{error}</p>
      )}

      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <span className="text-sm text-gray-500 mr-1">Category:</span>
        <button
          type="button"
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
            selectedCategory === null
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        {hasUncategorized && (
          <button
            type="button"
            onClick={() => setSelectedCategory('__uncategorized__')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
              selectedCategory === '__uncategorized__'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Uncategorized
          </button>
        )}
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                Name
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[28rem]">
                Description
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[16rem]">
                Install Command
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Downloads
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSkills.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No skills in this category.
                </td>
              </tr>
            ) : (
              filteredSkills.map((skill) => (
                <tr key={skill.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 w-40 align-top">
                    {skill.name ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 min-w-[28rem] max-w-none whitespace-normal align-top">
                    {skill.description ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 min-w-[16rem] max-w-none whitespace-normal align-top">
                    <div className="flex flex-wrap items-start gap-2">
                      <span className="break-all font-mono text-xs">
                        {installCommand(skill.path) ?? '—'}
                      </span>
                      {skill.path && (
                        <button
                          type="button"
                          onClick={() => copyInstallCommand(skill.path, skill.id)}
                          className="shrink-0 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                        >
                          {copiedId === skill.id ? 'Copied!' : 'Copy'}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {skill.category ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {skill.downloads != null ? skill.downloads : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
