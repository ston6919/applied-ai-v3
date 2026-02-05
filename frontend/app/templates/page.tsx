'use client'

// TEMPORARY MAINTENANCE MODE - Remove this block to restore normal functionality
// import { useState, useCallback } from 'react'
// import AutomationsList from '@/components/AutomationsList'

export default function TemplatesPage() {
  // TEMPORARY - Commented out to prevent loading
  // const [searchQuery, setSearchQuery] = useState('')
  // const [searchResults, setSearchResults] = useState<any[]>([])
  // const [searchTrigger, setSearchTrigger] = useState(0)

  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchQuery(e.target.value)
  // }

  // const handleSearchResults = useCallback((results: any[]) => {
  //   setSearchResults(results)
  // }, [])

  // const triggerSearch = () => {
  //   setSearchTrigger(prev => prev + 1)
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">n8n Templates</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Discover ready-to-use n8n workflow templates designed to 
          automate your business processes and boost productivity.
        </p>
      </div>
      
      {/* TEMPORARY MAINTENANCE MESSAGE */}
      <div className="text-center py-16">
        <div className="inline-block p-8 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">⚙️ Templates Are Being Recalibrated</h2>
          <p className="text-lg text-gray-700 mb-2">
            Our automation templates are currently getting a tune-up 🔧
          </p>
          <p className="text-base text-gray-600">
            We'll be back with more powerful workflows soon!
          </p>
        </div>
      </div>
      
      {/* ORIGINAL CODE - Uncomment to restore */}
      {/* <AutomationsList 
        searchQuery={searchQuery} 
        searchTrigger={searchTrigger}
        onSearchResults={handleSearchResults}
      /> */}
    </div>
  )
}
