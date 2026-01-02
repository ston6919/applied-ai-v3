'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface NewsItem {
  id: number
  title: string
  summary: string
  event_time: string | null
  status: string
  rank?: number
  created_at: string
  captured_stories_count: number
  show_source: boolean
  source_url?: string
  source_name?: string
}

interface PaginatedResponse {
  count: number
  next: string | null
  previous: string | null
  results: NewsItem[]
}

const formatDate = (iso: string | null): string => {
  if (!iso) return '—'
  try {
    const date = new Date(iso)
    const day = date.getUTCDate()
    const month = date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
    const year = date.getUTCFullYear()
    
    // Add ordinal suffix to day
    const getOrdinalSuffix = (day: number): string => {
      if (day >= 11 && day <= 13) {
        return 'th'
      }
      switch (day % 10) {
        case 1: return 'st'
        case 2: return 'nd'
        case 3: return 'rd'
        default: return 'th'
      }
    }
    
    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`
  } catch {
    return '—'
  }
}

export default function NewsList() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [nextPage, setNextPage] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchNews = useCallback(async (pageUrl?: string) => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || ''
      const apiBase = base ? base.replace(/\/$/, '') : ''
      const url = pageUrl || `${apiBase}/api/news/canonical-stories/?page=1&page_size=10`

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
      
      const data: PaginatedResponse = await res.json()
      const allItems: NewsItem[] = data.results || []
      
      // Filter to only show ranked stories with rank 2 or higher
      const rankedItems = allItems.filter(item => item.status === 'ranked' && item.rank && item.rank >= 2)
      
      if (pageUrl) {
        // Loading more items
        setNews(prev => [...prev, ...rankedItems])
        setLoadingMore(false)
      } else {
        // Initial load
        setNews(rankedItems)
        setLoading(false)
      }
      
      setNextPage(data.next)
      setHasMore(!!data.next)
      
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('[News] Error fetching news]:', {
        name: err?.name,
        message: err?.message,
        stack: err?.stack
      })
      setError(err?.message ?? 'Failed to load news')
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    fetchNews()
  }, [mounted, fetchNews])

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore || !nextPage) return
    
    setLoadingMore(true)
    fetchNews(nextPage)
  }, [loadingMore, hasMore, nextPage, fetchNews])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!mounted) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [mounted, hasMore, loadingMore, loadMore])

  if (!mounted || loading) {
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
            <span>{formatDate(item.event_time || item.created_at)}</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            {item.title}
          </h3>
          {item.show_source && item.source_url && (
            <div className="mt-2 text-sm">
              <a 
                href={item.source_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 underline flex items-center gap-1"
              >
                <span>{item.source_name || 'View Article'}</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </article>
      ))}
      
      {/* Loading more indicator */}
      {loadingMore && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">Loading more...</span>
        </div>
      )}
      
      {/* Intersection observer target */}
      {hasMore && !loadingMore && (
        <div ref={loadMoreRef} className="h-4" />
      )}
      
      {/* End of results indicator */}
      {!hasMore && news.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          You've reached the end of the news feed
        </div>
      )}
    </div>
  )
}
