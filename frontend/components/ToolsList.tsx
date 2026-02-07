'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
  affiliate_url?: string
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
  viewMode: 'cards' | 'table'
  setViewMode: (mode: 'cards' | 'table') => void
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSearchTrigger: () => void
  searchResultsCount: number
}

export default function ToolsList({ 
  searchQuery, 
  searchTrigger, 
  onSearchResults, 
  viewMode, 
  setViewMode,
  onSearchChange,
  onSearchTrigger,
  searchResultsCount
}: ToolsListProps) {
  const router = useRouter()
  const [tools, setTools] = useState<Tool[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [categories, setCategories] = useState<string[]>(['All'])
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [sortByUpdated, setSortByUpdated] = useState<'manual' | 'recent'>('manual')
  const observerTarget = useRef<HTMLDivElement>(null)

  // Debug component mount and state
  useEffect(() => {
    console.log('[ToolsList] Component mounted/updated', {
      toolsCount: tools.length,
      loading,
      searching,
      viewMode,
      searchQuery,
      sortByUpdated
    })
  }, [tools.length, loading, searching, viewMode, searchQuery, sortByUpdated])

  const fetchTools = useCallback(async (page: number, reset: boolean = false) => {
    console.log('[ToolsList] fetchTools called', { page, reset, viewMode, searchQuery, sortByUpdated })
    
    try {
      if (page === 1 && reset) {
        console.log('[ToolsList] Setting loading to true')
        setLoading(true)
      } else {
        console.log('[ToolsList] Setting loadingMore to true')
        setLoadingMore(true)
      }

      // Determine ordering parameter
      let orderingParam = 'manual'
      if (viewMode === 'table' && (!searchQuery || searchQuery.trim() === '')) {
        orderingParam = sortByUpdated === 'recent' ? 'recent' : 'manual'
      }

      console.log('[ToolsList] Fetching from API', { page, orderingParam })

      // Call our API route which uses service role key
      const response = await fetch(`/api/tools?page=${page}&pageSize=20&ordering=${orderingParam}`)
      
      console.log('[ToolsList] API response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('[ToolsList] API error:', errorData)
        throw new Error(`Failed to fetch tools: ${errorData.error || response.statusText}`)
      }
      
      const data = await response.json()
      console.log('[ToolsList] API response data:', {
        resultsCount: data.results?.length || 0,
        totalCount: data.count || 0,
        hasNext: !!data.next,
        sample: data.results?.[0]
      })

      const toolsData = data.results || []
      
      // Update tools
      setTools(prev => {
        const newTools = reset ? toolsData : [...prev, ...toolsData]
        console.log('[ToolsList] Updating tools state', { 
          prevCount: prev.length, 
          newCount: newTools.length,
          reset 
        })
        
        // Extract unique categories (empty for now since Supabase doesn't have categories)
        setCategories(['All'])
        
        return newTools
      })
      
      // Check if there are more pages
      const hasMorePages = !!data.next
      console.log('[ToolsList] Pagination check', { 
        returnedCount: toolsData.length, 
        hasMore: hasMorePages 
      })
      setHasMore(hasMorePages)
      
    } catch (error) {
      console.error('[ToolsList] Error fetching tools:', error)
      if (error instanceof Error) {
        console.error('[ToolsList] Error details:', {
          message: error.message,
          stack: error.stack
        })
      }
    } finally {
      console.log('[ToolsList] Setting loading states to false')
      setLoading(false)
      setLoadingMore(false)
    }
  }, [viewMode, searchQuery, sortByUpdated])

  // Initial load and reload when viewMode or sort changes
  useEffect(() => {
    console.log('[ToolsList] Initial load effect triggered')
    fetchTools(1, true)
    setCurrentPage(1)
  }, [fetchTools])
  
  // Refetch when sort order changes
  useEffect(() => {
    if (viewMode === 'table') {
      fetchTools(1, true)
      setCurrentPage(1)
    }
  }, [sortByUpdated, viewMode, fetchTools])

  const performSearch = useCallback(async () => {
    setSearching(true)
    
    try {
      const query = searchQuery?.trim() || ''
      
      console.log('[ToolsList] Performing search', { query })

      // Call our API route which uses service role key
      const response = await fetch('/api/tools/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      console.log('[ToolsList] Search API response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('[ToolsList] Search API error:', errorData)
        throw new Error(`Search failed: ${errorData.error || response.statusText}`)
      }

      const data = await response.json()
      console.log('[ToolsList] Search results:', {
        query: data.query,
        resultsCount: data.results?.length || 0,
        total: data.total || 0
      })

      setSearchResults(data.results || [])
      if (onSearchResults) {
        onSearchResults(data.results || [])
      }
    } catch (error) {
      console.error('[ToolsList] Search error:', error)
      setSearchResults([])
      if (onSearchResults) {
        onSearchResults([])
      }
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
  
  console.log('[ToolsList] Display tools calculation:', {
    searchQuery,
    searchResultsLength: searchResults.length,
    toolsLength: tools.length,
    displayToolsLength: displayTools.length,
    selectedCategory,
    loading,
    searching
  })

  const filteredTools = (selectedCategory === 'All' 
    ? displayTools 
    : displayTools.filter(tool => tool.categories.some(cat => cat.name === selectedCategory))
  ).sort((a, b) => {
    // Only prioritize featured tools in card view, not in table view
    if (viewMode === 'cards') {
      if (a.is_featured && !b.is_featured) return -1
      if (!a.is_featured && b.is_featured) return 1
    }
    return 0
  })

  console.log('[ToolsList] Filtered tools:', {
    filteredToolsLength: filteredTools.length,
    selectedCategory
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
    console.log('[ToolsList] Rendering empty state:', {
      filteredToolsLength: filteredTools.length,
      loading,
      searching,
      searchQuery,
      selectedCategory,
      toolsLength: tools.length,
      displayToolsLength: displayTools.length,
      searchResultsLength: searchResults.length
    })
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
      {/* Category Filter and View Toggle */}
      <div className="mb-5">
        {/* Category Filter - Only show in card view */}
        {viewMode === 'cards' && (
          <div className="flex flex-wrap gap-2 justify-center mb-4">
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
        )}
        
        {/* Search Bar and View Toggle */}
        <div className="flex items-center justify-end gap-3">
          {/* Compact Search Bar - Only show in table view */}
          {viewMode === 'table' && (
            <div className="w-64">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={onSearchChange}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      onSearchTrigger()
                    }
                  }}
                  className="w-full px-3 py-2 pl-9 pr-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              {searchQuery && searchResultsCount > 0 && (
                <div className="mt-1 text-xs text-gray-600 text-right">
                  Found {searchResultsCount} tool{searchResultsCount === 1 ? '' : 's'}
                </div>
              )}
            </div>
          )}
          
          {/* View Mode Toggle */}
          <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title="Table View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'cards'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title="Card View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setSortByUpdated(sortByUpdated === 'recent' ? 'manual' : 'recent')}
              >
                <div className="flex items-center gap-1">
                  Updated
                  <svg 
                    className={`w-4 h-4 transition-transform ${sortByUpdated === 'recent' ? '' : 'rotate-180 opacity-50'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTools.map((tool) => {
                // Get relevance score if this is a search result
                const searchResult = searchQuery && searchResults.length > 0 
                  ? searchResults.find(result => result.tool.id === tool.id)
                  : null
                
                return (
                  <tr 
                    key={tool.id} 
                    onClick={() => router.push(`/tools/${tool.id}`)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    {/* Name Column */}
                    <td className="px-6 py-2 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-semibold text-gray-900">
                          {tool.name}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {searchResult && (
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                              {Math.round(searchResult.relevance_score * 100)}%
                            </span>
                          )}
                          {tool.categories.length > 0 && (
                            <span className="inline-block bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded">
                              {tool.categories[0].name}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    {/* Updated Column */}
                    <td className="px-6 py-2 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {tool.last_updated 
                          ? new Date(tool.last_updated).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: '2-digit' 
                            }).replace(',', '')
                          : tool.updated_at 
                            ? new Date(tool.updated_at).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: '2-digit' 
                              }).replace(',', '')
                            : '-'
                        }
                      </div>
                    </td>
                    
                    {/* Description Column (Largest) */}
                    <td className="px-6 py-2">
                      <div className="text-sm text-gray-600 max-w-2xl">
                        {tool.short_description}
                      </div>
                    </td>
                    
                    {/* Actions Column */}
                    <td className="px-6 py-2 whitespace-nowrap text-right">
                      <div className="flex gap-2 justify-end">
                        <a 
                          href={tool.affiliate_url || tool.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                        >
                          Try Now
                        </a>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Card View */}
      {viewMode === 'cards' && (
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
      )}

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
