'use client'

import { useState, useEffect } from 'react'

interface Automation {
  id: number
  name: string
  description: string
  category: string
  complexity: 'Beginner' | 'Intermediate' | 'Advanced'
  time_saved: string
  status: 'Available' | 'Coming Soon'
}

export default function AutomationsList() {
  const [automations, setAutomations] = useState<Automation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call - replace with actual API endpoint
    const fetchAutomations = async () => {
      try {
        // Mock data
        const mockAutomations: Automation[] = [
          {
            id: 1,
            name: "Email Response Automation",
            description: "Automatically categorize and draft responses to incoming emails using AI.",
            category: "Communication",
            complexity: "Intermediate",
            time_saved: "2-3 hours/week",
            status: "Available"
          },
          {
            id: 2,
            name: "Social Media Content Scheduler",
            description: "Generate and schedule social media posts across multiple platforms automatically.",
            category: "Marketing",
            complexity: "Beginner",
            time_saved: "5-7 hours/week",
            status: "Available"
          },
          {
            id: 3,
            name: "Data Report Generator",
            description: "Automatically generate weekly/monthly reports from your data sources.",
            category: "Analytics",
            complexity: "Advanced",
            time_saved: "4-6 hours/week",
            status: "Available"
          },
          {
            id: 4,
            name: "Customer Support Bot",
            description: "AI-powered chatbot that handles common customer inquiries 24/7.",
            category: "Customer Service",
            complexity: "Advanced",
            time_saved: "10-15 hours/week",
            status: "Coming Soon"
          },
          {
            id: 5,
            name: "Invoice Processing",
            description: "Automatically extract data from invoices and update your accounting system.",
            category: "Finance",
            complexity: "Intermediate",
            time_saved: "3-4 hours/week",
            status: "Available"
          },
          {
            id: 6,
            name: "Lead Qualification",
            description: "Automatically score and qualify leads based on predefined criteria.",
            category: "Sales",
            complexity: "Intermediate",
            time_saved: "2-3 hours/week",
            status: "Coming Soon"
          }
        ]
        setAutomations(mockAutomations)
      } catch (error) {
        console.error('Error fetching automations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAutomations()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {automations.map((automation) => (
        <div key={automation.id} className="card hover:shadow-lg transition-shadow duration-300">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="inline-block bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
              {automation.category}
            </span>
            <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${
              automation.complexity === 'Beginner'
                ? 'bg-green-100 text-green-800'
                : automation.complexity === 'Intermediate'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {automation.complexity}
            </span>
            <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${
              automation.status === 'Available'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {automation.status}
            </span>
          </div>
          
          <h3 className="text-xl font-semibold mb-3 text-gray-900">
            {automation.name}
          </h3>
          
          <p className="text-gray-600 mb-4">
            {automation.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <span className="font-medium">Time Saved:</span> {automation.time_saved}
            </div>
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                automation.status === 'Available'
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={automation.status === 'Coming Soon'}
            >
              {automation.status === 'Available' ? 'Get Started' : 'Coming Soon'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
