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

  useEffect(() => {
    // Simulate API call - replace with actual API endpoint
    const fetchNews = async () => {
      try {
        // For now, using mock data
        const mockNews: NewsItem[] = [
          {
            id: 1,
            title: "OpenAI Releases GPT-4 Turbo with Enhanced Capabilities",
            summary: "The latest version of GPT-4 Turbo offers improved reasoning, reduced costs, and better performance across various tasks.",
            published_at: "2024-01-15",
            category: "AI Models",
            url: "#"
          },
          {
            id: 2,
            title: "Google's Gemini Pro Now Available for Developers",
            summary: "Google's multimodal AI model is now accessible through their API, offering competitive performance in text and image understanding.",
            published_at: "2024-01-14",
            category: "AI Models",
            url: "#"
          },
          {
            id: 3,
            title: "AI Automation Tools See 300% Growth in Enterprise Adoption",
            summary: "Businesses are rapidly adopting AI automation tools to streamline operations and reduce manual work.",
            published_at: "2024-01-13",
            category: "Business",
            url: "#"
          }
        ]
        setNews(mockNews)
      } catch (error) {
        console.error('Error fetching news:', error)
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
