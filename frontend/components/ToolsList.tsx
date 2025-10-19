'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

interface Category {
  id: number
  name: string
}

interface Tool {
  id: number
  name: string
  short_description: string
  description: string
  features: string[]
  new_features: string[]
  website_url: string
  source_url?: string
  image_url?: string
  external_id?: string
  show_on_site: boolean
  pricing: string
  is_featured: boolean
  date_added?: string
  last_updated?: string
  categories: Category[]
  created_at: string
  updated_at: string
}

interface SearchResult {
  tool: Tool
  relevance_score: number
  metadata: any
}

interface ToolsListProps {
  searchQuery?: string
  searchTrigger?: number
  onSearchResults?: (results: SearchResult[]) => void
}

export default function ToolsList({ searchQuery, searchTrigger, onSearchResults }: ToolsListProps) {
  const [tools, setTools] = useState<Tool[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [categories, setCategories] = useState<string[]>(['All'])
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observerTarget = useRef<HTMLDivElement>(null)

  const fetchTools = useCallback(async (page: number, reset: boolean = false) => {
    try {
      if (page === 1 && reset) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const base = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8010'
      const response = await fetch(`${base}/api/tools/?page=${page}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch tools')
      }
      
      const data = await response.json()
      const toolsData = data.results || data
      
      // Update tools and extract categories
      setTools(prev => {
        const newTools = reset ? toolsData : [...prev, ...toolsData]
        
        // Extract unique categories from all tools
        const uniqueCategories = new Set<string>()
        newTools.forEach((tool: Tool) => {
          tool.categories.forEach(cat => uniqueCategories.add(cat.name))
        })
        setCategories(['All', ...Array.from(uniqueCategories).sort()])
        
        return newTools
      })
      
      // Check if there are more pages
      setHasMore(!!data.next)
      
    } catch (error) {
      console.error('Error fetching tools:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchTools(1, true)
  }, [fetchTools])

  const performSearch = useCallback(async () => {
    
    setSearching(true)
    
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8010'
      const searchUrl = `${base}/api/tools/search/`
      const searchBody = { query: searchQuery || '' }
      
      
      
      const response = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchBody),
      })

      
      
      const data = await response.json()
      
      
      if (!response.ok) {
        
        throw new Error(`Search failed with status ${response.status}: ${data.error || 'Unknown error'}`)
      }
      
      
      
      // Show the embedding vector from OpenAI
      if (data.debug && data.debug.openai_response && data.debug.openai_response.embedding_vector) {
        
      }
      
      setSearchResults(data.results || [])
      if (onSearchResults) {
        
        onSearchResults(data.results || [])
      }
    } catch (error) {
      
      setSearchResults([])
    } finally {
      setSearching(false)
      
    }
  }, [searchQuery, onSearchResults])

  // Trigger search when searchTrigger changes
  useEffect(() => {
    if (searchTrigger !== undefined && searchTrigger > 0) {
      performSearch()
    } else {
      
    }
  }, [searchTrigger, performSearch])

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          const nextPage = currentPage + 1
          setCurrentPage(nextPage)
          fetchTools(nextPage, false)
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, loading, loadingMore, currentPage, fetchTools])

  // Determine which tools to display
  const displayTools = searchQuery && searchQuery.trim() !== '' && searchResults.length > 0
    ? searchResults.map(result => result.tool)
    : tools
  
  

  const filteredTools = (selectedCategory === 'All' 
    ? displayTools 
    : displayTools.filter(tool => tool.categories.some(cat => cat.name === selectedCategory))
  ).sort((a, b) => {
    // Featured tools first
    if (a.is_featured && !b.is_featured) return -1
    if (!a.is_featured && b.is_featured) return 1
    return 0
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (searching) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600">Searching...</span>
      </div>
    )
  }

  if (filteredTools.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          {searchQuery 
            ? `No tools found for "${searchQuery}". Try a different search term.`
            : selectedCategory === 'All' 
              ? 'No tools available yet. Check back soon!' 
              : `No tools found in the "${selectedCategory}" category.`}
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTools.map((tool) => {
          // Get relevance score if this is a search result
          const searchResult = searchQuery && searchResults.length > 0 
            ? searchResults.find(result => result.tool.id === tool.id)
            : null
          
          return (
            <div key={tool.id} className="card hover:shadow-lg transition-shadow duration-300 flex flex-col">
              {/* Image */}
              {tool.image_url && (
                <Link href={`/tools/${tool.id}`}>
                  <div className="mb-4 h-48 relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer">
                    <img 
                      src={tool.image_url} 
                      alt={tool.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                </Link>
              )}
              
              {/* Badges */}
              <div className="mb-4 flex flex-wrap gap-2">
                {searchResult && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                    Relevance: {Math.round(searchResult.relevance_score * 100)}%
                  </span>
                )}
                {tool.is_featured && (
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                    ⭐ Featured
                  </span>
                )}
                {tool.categories.map((cat) => (
                  <span key={cat.id} className="inline-block bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                    {cat.name}
                  </span>
                ))}
                <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${
                  tool.pricing === 'free' || tool.pricing === 'freemium'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
                </span>
              </div>
            
            {/* Content */}
            <Link href={`/tools/${tool.id}`}>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 hover:text-primary-600 transition-colors cursor-pointer">
                {tool.name}
              </h3>
            </Link>
            <p className="text-gray-600 mb-4">
              {tool.short_description}
            </p>
            
            {/* Features */}
            {tool.features && tool.features.length > 0 && (
              <ul className="mb-4 space-y-1 flex-grow">
                {tool.features.slice(0, 3).map((feature, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            )}
            
            {/* CTA */}
            <Link 
              href={`/tools/${tool.id}`}
              className="btn-primary inline-block text-center mt-auto"
            >
              Learn More →
            </Link>
          </div>
          )
        })}
      </div>

      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      <div ref={observerTarget} className="h-4" />

      {/* End of Results Message */}
      {!hasMore && filteredTools.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">You've reached the end of the list</p>
        </div>
      )}
    </div>
  )
}
