'use client'

import { useState, useEffect } from 'react'

interface NewsItem {
  id: number
  title: string
  summary: string
  published_at: string
  category: string
  url?: string
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
        const url = `${apiBase}/api/news/articles/`

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
        const items: NewsItem[] = Array.isArray(data) ? data : (data.results ?? [])
        setNews(items)
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error('[News] Error fetching news:', {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {news.map((item) => (
        <article key={item.id} className="card hover:shadow-lg transition-shadow duration-300">
          <div className="mb-4">
            <span className="inline-block bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
              {item.category}
            </span>
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900 line-clamp-2">
            {item.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {item.summary}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {new Date(item.published_at).toLocaleDateString()}
            </span>
            {item.url && (
              <a 
                href={item.url} 
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                Read More →
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
