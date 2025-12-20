'use client'

import { useState, useCallback } from 'react'
import AutomationsList from '@/components/AutomationsList'

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchTrigger, setSearchTrigger] = useState(0)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchResults = useCallback((results: any[]) => {
    setSearchResults(results)
  }, [])

  const triggerSearch = () => {
    setSearchTrigger(prev => prev + 1)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">n8n Templates</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Discover ready-to-use n8n workflow templates designed to 
          automate your business processes and boost productivity.
        </p>
        
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search for automation templates..."
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
                ? `Found ${searchResults.length} template${searchResults.length === 1 ? '' : 's'} for "${searchQuery}"`
                : ''
              }
            </div>
          )}
        </div>
      </div>
      <AutomationsList 
        searchQuery={searchQuery} 
        searchTrigger={searchTrigger}
        onSearchResults={handleSearchResults}
      />
    </div>
  )
}
