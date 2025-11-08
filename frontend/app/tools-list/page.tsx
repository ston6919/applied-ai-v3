'use client'

import { useState, useCallback } from 'react'
import ToolsList from '@/components/ToolsList'

export default function ToolsListPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchTrigger, setSearchTrigger] = useState(0)
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    console.log('[Tools List Page] Search query changed:', newQuery)
    setSearchQuery(newQuery)
  }

  const handleSearchResults = useCallback((results: any[]) => {
    console.log('[Tools List Page] Received search results:', results.length, 'tools')
    console.log('[Tools List Page] Full results:', results)
    setSearchResults(results)
  }, [])

  const triggerSearch = () => {
    console.log('[Tools List Page] Triggering search for query:', searchQuery)
    setSearchTrigger(prev => {
      const newTrigger = prev + 1
      console.log('[Tools List Page] Search trigger updated to:', newTrigger)
      return newTrigger
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Tools & Resources</h1>
        <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
          Discover powerful AI tools and resources to enhance your productivity 
          and streamline your workflows.
        </p>
        
        {/* Mastermind CTA Button */}
        <div className="mb-8">
          <a
            href="https://www.skool.com/applied-ai-mastermind-9612"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gradient"
          >
            Join the Mastermind
          </a>
        </div>
        
        {/* Search Bar - Card View (Centered) */}
        {viewMode === 'cards' && (
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search for AI tools..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      triggerSearch()
                    }
                  }}
                  className="w-full px-4 py-3 pl-12 pr-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <button
                onClick={triggerSearch}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
              >
                Search
              </button>
            </div>
            {searchQuery && (
              <div className="mt-2 text-sm text-gray-600">
                {searchResults.length > 0 
                  ? `Found ${searchResults.length} tool${searchResults.length === 1 ? '' : 's'} for "${searchQuery}"`
                  : ''
                }
              </div>
            )}
          </div>
        )}
      </div>
      
      <ToolsList 
        searchQuery={searchQuery} 
        searchTrigger={searchTrigger}
        onSearchResults={handleSearchResults}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onSearchChange={handleSearchChange}
        onSearchTrigger={triggerSearch}
        searchResultsCount={searchResults.length}
      />
    </div>
  )
}

