'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

export default function ToolDetailPage({ params }: { params: { id: string } }) {
  const [tool, setTool] = useState<Tool | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8010'
        const response = await fetch(`${base}/api/tools/${params.id}/`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Tool not found')
          } else {
            setError('Failed to load tool')
          }
          return
        }
        
        const data = await response.json()
        setTool(data)
      } catch (error) {
        console.error('Error fetching tool:', error)
        setError('Failed to load tool')
      } finally {
        setLoading(false)
      }
    }

    fetchTool()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  if (error || !tool) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg mb-4">{error || 'Tool not found'}</p>
          <Link href="/tools" className="btn-primary inline-block">
            ← Back to All Tools
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/tools" className="text-primary-600 hover:text-primary-700 font-medium">
          ← Back to All Tools
        </Link>
      </div>

      {/* Hero Section with Image */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        {tool.image_url && (
          <div className="w-full bg-gray-100 flex items-center justify-center">
            <img 
              src={tool.image_url} 
              alt={tool.name}
              className="w-full h-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
        )}
        
        <div className="p-8">
          {/* Badges */}
          <div className="mb-4 flex flex-wrap gap-2">
            {tool.is_featured && (
              <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                ⭐ Featured
              </span>
            )}
            {tool.categories.map((cat) => (
              <span key={cat.id} className="inline-block bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
                {cat.name}
              </span>
            ))}
            <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${
              tool.pricing === 'free' || tool.pricing === 'freemium'
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
            </span>
          </div>

          {/* Title and Short Description */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {tool.name}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {tool.short_description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <a 
              href={tool.affiliate_url || tool.website_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary inline-block"
            >
              Visit Website →
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column - Description and Features */}
        <div className="lg:col-span-2 space-y-8">
          {/* Full Description */}
          {tool.description && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {tool.name}</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {tool.description}
              </p>
            </div>
          )}

          {/* Features */}
          {tool.features && tool.features.length > 0 && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
              <ul className="space-y-3">
                {tool.features.map((feature, idx) => (
                  <li key={idx} className="text-gray-700 flex items-start">
                    <span className="text-primary-600 mr-3 text-xl">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* New Features */}
          {tool.new_features && tool.new_features.length > 0 && (
            <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🎉 What's New</h2>
              <ul className="space-y-3">
                {tool.new_features.map((feature, idx) => (
                  <li key={idx} className="text-gray-700 flex items-start">
                    <span className="text-primary-600 mr-3 text-xl">✨</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar - Quick Info */}
        <div className="space-y-6">
          {/* Quick Info Card */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Info</h3>
            
            <div className="space-y-4">
              {/* Pricing */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Pricing</p>
                <p className="text-gray-900 font-medium capitalize">{tool.pricing}</p>
              </div>

              {/* Categories */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {tool.categories.map((cat) => (
                    <span key={cat.id} className="inline-block bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded">
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Date Added */}
              {tool.date_added && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date Added</p>
                  <p className="text-gray-900">
                    {new Date(tool.date_added).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              )}

              {/* Last Updated */}
              {tool.last_updated && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                  <p className="text-gray-900">
                    {new Date(tool.last_updated).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* CTA Card */}
          <div className="card bg-gradient-to-br from-primary-600 to-primary-700 text-white">
            <h3 className="text-xl font-bold mb-3">Ready to try {tool.name}?</h3>
            <p className="mb-4 text-primary-100">
              Visit their website to learn more and get started.
            </p>
            <a 
              href={tool.affiliate_url || tool.website_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-secondary inline-block w-full text-center bg-white text-primary-600 hover:bg-gray-100"
            >
              Visit Website →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

