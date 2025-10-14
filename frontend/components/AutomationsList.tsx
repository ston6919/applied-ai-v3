'use client'

import { useState, useEffect, useCallback } from 'react'

interface N8nTemplate {
  id: number
  name: string
  description: string
  download_url: string
  external_id: string | null
  score: number
  created_at: string
  updated_at: string
}

interface SearchResult {
  template: N8nTemplate
  relevance_score: number
  metadata: any
}

interface AutomationsListProps {
  searchQuery?: string
  searchTrigger?: number
  onSearchResults?: (results: SearchResult[]) => void
}

export default function AutomationsList({ searchQuery, searchTrigger, onSearchResults }: AutomationsListProps) {
  const [templates, setTemplates] = useState<N8nTemplate[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8010/api/n8n-templates/templates/')
        if (!response.ok) {
          throw new Error('Failed to fetch templates')
        }
        const data = await response.json()
        setTemplates(data.results || data)
      } catch (error) {
        console.error('Error fetching n8n templates:', error)
        setTemplates([])
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  const performSearch = useCallback(async () => {
    if (!searchQuery || searchQuery.trim() === '') {
      setSearchResults([])
      return
    }

    setSearching(true)
    
    try {
      const response = await fetch('http://127.0.0.1:8010/api/n8n-templates/templates/search/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(`Search failed with status ${response.status}: ${data.error || 'Unknown error'}`)
      }
      
      setSearchResults(data.results || [])
      if (onSearchResults) {
        onSearchResults(data.results || [])
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }, [searchQuery, onSearchResults])

  // Trigger search when searchTrigger changes
  useEffect(() => {
    if (searchTrigger !== undefined && searchTrigger > 0) {
      performSearch()
    }
  }, [searchTrigger, performSearch])

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

  // Determine which templates to display
  const displayTemplates = searchQuery && searchQuery.trim() !== '' && searchResults.length > 0 
    ? searchResults.map(result => result.template)
    : templates

  if (displayTemplates.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">
          {searchQuery 
            ? `No templates found for "${searchQuery}". Try a different search term.`
            : 'No n8n templates available yet. Check back soon!'
          }
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {displayTemplates.map((template) => {
        // Get relevance score if this is a search result
        const searchResult = searchQuery && searchResults.length > 0 
          ? searchResults.find(result => result.template.id === template.id)
          : null
        
        return (
          <div key={template.id} className="card hover:shadow-lg transition-shadow duration-300">
            <div className="mb-4 flex flex-wrap gap-2">
              {template.score > 0 && (
                <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  Score: {template.score}
                </span>
              )}
              {searchResult && (
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  Relevance: {Math.round(searchResult.relevance_score * 100)}%
                </span>
              )}
            </div>
            
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              {template.name}
            </h3>
            
            <p className="text-gray-600 mb-4">
              {template.description}
            </p>
            
            <div className="flex items-center justify-end">
              <a 
                href={template.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-primary-600 text-white hover:bg-primary-700"
              >
                Download
              </a>
            </div>
          </div>
        )
      })}
    </div>
  )
}