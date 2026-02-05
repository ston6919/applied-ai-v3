'use client'

// TEMPORARY MAINTENANCE MODE - Remove this block to restore normal functionality
// import { useState, useCallback } from 'react'
// import ToolsList from '@/components/ToolsList'

export default function ToolsPage() {
  // TEMPORARY - Commented out to prevent loading
  // const [searchQuery, setSearchQuery] = useState('')
  // const [searchResults, setSearchResults] = useState<any[]>([])
  // const [searchTrigger, setSearchTrigger] = useState(0)
  // const [viewMode, setViewMode] = useState<'cards' | 'table'>('table')

  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const newQuery = e.target.value
  //   console.log('[Tools Page] Search query changed:', newQuery)
  //   setSearchQuery(newQuery)
  // }

  // const handleSearchResults = useCallback((results: any[]) => {
  //   console.log('[Tools Page] Received search results:', results.length, 'tools')
  //   console.log('[Tools Page] Full results:', results)
  //   setSearchResults(results)
  // }, [])

  // const triggerSearch = () => {
  //   console.log('[Tools Page] Triggering search for query:', searchQuery)
  //   setSearchTrigger(prev => {
  //     const newTrigger = prev + 1
  //     console.log('[Tools Page] Search trigger updated to:', newTrigger)
  //     return newTrigger
  //   })
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Tools & Resources</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover powerful AI tools and resources to enhance your productivity 
          and streamline your workflows.
        </p>
      </div>
      
      {/* TEMPORARY MAINTENANCE MESSAGE */}
      <div className="text-center py-16">
        <div className="inline-block p-8 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">🛠️ Tools Are Getting Sharpened</h2>
          <p className="text-lg text-gray-700 mb-2">
            Our tool collection is currently being polished to perfection ✨
          </p>
          <p className="text-base text-gray-600">
            Check back soon for an even better experience!
          </p>
        </div>
      </div>
      
      {/* ORIGINAL CODE - Uncomment to restore */}
      {/* <ToolsList 
        searchQuery={searchQuery} 
        searchTrigger={searchTrigger}
        onSearchResults={handleSearchResults}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onSearchChange={handleSearchChange}
        onSearchTrigger={triggerSearch}
        searchResultsCount={searchResults.length}
      /> */}
    </div>
  )
}
