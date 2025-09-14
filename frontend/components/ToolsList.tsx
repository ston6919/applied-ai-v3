'use client'

import { useState, useEffect } from 'react'

interface Tool {
  id: number
  name: string
  description: string
  category: string
  url?: string
  pricing: string
}

export default function ToolsList() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Content Creation', 'Data Analysis', 'Automation', 'Development', 'Design']

  useEffect(() => {
    // Simulate API call - replace with actual API endpoint
    const fetchTools = async () => {
      try {
        // Mock data
        const mockTools: Tool[] = [
          {
            id: 1,
            name: "ChatGPT",
            description: "Advanced conversational AI for content creation, coding assistance, and problem-solving.",
            category: "Content Creation",
            url: "https://chat.openai.com",
            pricing: "Freemium"
          },
          {
            id: 2,
            name: "GitHub Copilot",
            description: "AI-powered code completion and generation tool for developers.",
            category: "Development",
            url: "https://github.com/features/copilot",
            pricing: "Paid"
          },
          {
            id: 3,
            name: "Zapier",
            description: "Automate workflows by connecting your favorite apps and services.",
            category: "Automation",
            url: "https://zapier.com",
            pricing: "Freemium"
          },
          {
            id: 4,
            name: "Tableau",
            description: "Data visualization and business intelligence platform with AI insights.",
            category: "Data Analysis",
            url: "https://tableau.com",
            pricing: "Paid"
          },
          {
            id: 5,
            name: "Canva AI",
            description: "Design tool with AI-powered features for creating graphics and presentations.",
            category: "Design",
            url: "https://canva.com",
            pricing: "Freemium"
          },
          {
            id: 6,
            name: "Notion AI",
            description: "AI writing assistant integrated into Notion for content creation and organization.",
            category: "Content Creation",
            url: "https://notion.so",
            pricing: "Paid"
          }
        ]
        setTools(mockTools)
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
    : tools.filter(tool => tool.category === selectedCategory)

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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
          <div key={tool.id} className="card hover:shadow-lg transition-shadow duration-300">
            <div className="mb-4">
              <span className="inline-block bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
                {tool.category}
              </span>
              <span className={`ml-2 inline-block text-sm font-medium px-3 py-1 rounded-full ${
                tool.pricing === 'Free' || tool.pricing === 'Freemium'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {tool.pricing}
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              {tool.name}
            </h3>
            <p className="text-gray-600 mb-4">
              {tool.description}
            </p>
            {tool.url && (
              <a 
                href={tool.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary inline-block"
              >
                Visit Tool →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
