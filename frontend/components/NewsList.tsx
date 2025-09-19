'use client'

import { useState, useEffect } from 'react'

interface NewsItem {
  id: number
  title: string
  summary: string
  event_time: string
  status: string
  rank?: number
  created_at: string
  captured_stories_count: number
}

const formatDate = (iso: string): string => {
  const d = new Date(iso)
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const day = d.getDate()
  const suffix = (n: number) => {
    if (n % 100 >= 11 && n % 100 <= 13) return 'th'
    switch (n % 10) {
      case 1: return 'st'
      case 2: return 'nd'
      case 3: return 'rd'
      default: return 'th'
    }
  }
  const mon = months[d.getMonth()]
  const yr = String(d.getFullYear())
  return `${day}${suffix(day)} ${mon} ${yr}`
}

export default function NewsList() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || ''
        const apiBase = base ? base.replace(/\/$/, '') : ''
        const url = `${apiBase}/api/news/canonical-stories/`

        // Debug details
        // eslint-disable-next-line no-console
        console.log('[News] Fetching', {
          origin: typeof window !== 'undefined' ? window.location.origin : 'ssr',
          NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
          apiBase,
          url
        })

        const res = await fetch(url, { next: { revalidate: 60 } })

        // eslint-disable-next-line no-console
        console.log('[News] Response', {
          ok: res.ok,
          status: res.status,
          statusText: res.statusText,
          finalURL: (res as any).url,
          contentType: res.headers.get('content-type')
        })
        if (!res.ok) {
          throw new Error(`Failed to fetch news: ${res.status}`)
        }
        const data = await res.json()
        const allItems: NewsItem[] = Array.isArray(data) ? data : (data.results ?? [])
        // Filter to only show ranked stories with rank 2 or higher
        const rankedItems = allItems.filter(item => item.status === 'ranked' && item.rank && item.rank >= 2)
        setNews(rankedItems)
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error('[News] Error fetching news]:', {
          name: err?.name,
          message: err?.message,
          stack: err?.stack
        })
        setError(err?.message ?? 'Failed to load news')
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">{error}</div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {news.map((item) => (
        <article key={item.id} className="card p-4 hover:shadow-lg transition-shadow duration-300">
          <div className="mb-2 text-sm text-gray-500">
            <span>{formatDate(item.event_time)}</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            {item.title}
          </h3>
          <div className="mt-3 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {item.captured_stories_count} source{item.captured_stories_count !== 1 ? 's' : ''}
            </span>
            <span className="text-xs text-gray-400">
              Created {formatDate(item.created_at)}
            </span>
          </div>
        </article>
      ))}
    </div>
  )
}
