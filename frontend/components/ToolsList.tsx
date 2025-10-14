'use client'

import { useState, useEffect } from 'react'

interface Category {
  id: number
  name: string
}

interface Tool {
  id: number
  name: string
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

export default function ToolsList() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [categories, setCategories] = useState<string[]>(['All'])

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8010'
        const response = await fetch(`${base}/api/tools/`)
        if (!response.ok) {
          throw new Error('Failed to fetch tools')
        }
        const data = await response.json()
        const toolsData = data.results || data
        setTools(toolsData)
        
        // Extract unique categories
        const uniqueCategories = new Set<string>()
        toolsData.forEach((tool: Tool) => {
          tool.categories.forEach(cat => uniqueCategories.add(cat.name))
        })
        setCategories(['All', ...Array.from(uniqueCategories).sort()])
      } catch (error) {
        console.error('Error fetching tools:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTools()
  }, [])

  const filteredTools = selectedCategory === 'All' 
    ? tools 
    : tools.filter(tool => tool.categories.some(cat => cat.name === selectedCategory))

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (filteredTools.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          {selectedCategory === 'All' 
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
        {filteredTools.map((tool) => (
          <div key={tool.id} className="card hover:shadow-lg transition-shadow duration-300 flex flex-col">
            {/* Image */}
            {tool.image_url && (
              <div className="mb-4 h-48 relative overflow-hidden rounded-lg bg-gray-100">
                <img 
                  src={tool.image_url} 
                  alt={tool.name}
                  className="w-full h-full object-contain p-4"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}
            
            {/* Badges */}
            <div className="mb-4 flex flex-wrap gap-2">
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
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              {tool.name}
            </h3>
            <p className="text-gray-600 mb-4 flex-grow">
              {tool.description}
            </p>
            
            {/* Features */}
            {tool.features && tool.features.length > 0 && (
              <ul className="mb-4 space-y-1">
                {tool.features.slice(0, 3).map((feature, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            )}
            
            {/* CTA */}
            <a 
              href={tool.website_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary inline-block text-center mt-auto"
            >
              Visit Tool →
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
