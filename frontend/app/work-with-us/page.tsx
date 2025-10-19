'use client'

import { useState } from 'react'

export default function WorkWithUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessName: '',
    projectNature: '',
    budget: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/waiting-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          business_name: formData.businessName,
          project_nature: formData.projectNature,
          budget: formData.budget
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to submit form: ${errorData.error || 'Unknown error'}`)
      }

      const result = await response.json()
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        businessName: '',
        projectNature: '',
        budget: ''
      })
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-8 gradient-text text-soft-shadow leading-tight py-2">
              Join The Waiting List
            </h1>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/60">
              <p className="text-xl md:text-2xl mb-6 text-gray-700">
                We're not currently accepting new clients.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Join our waiting list and be the first to know when we're ready to take on new projects. 
                We'll reach out when we have capacity and your project aligns with our expertise.
              </p>
              <p className="text-base text-gray-600">
                If you want to feature your tool with us or sponsor our content, please visit our{' '}
                <a href="/contact" className="text-primary-600 hover:text-primary-700 font-medium underline">
                  contact page
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/60">
              {submitStatus === 'success' ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank you for joining our waiting list!</h2>
                  <p className="text-gray-600">
                    We'll be in touch when we have capacity for new projects. In the meantime, 
                    feel free to explore our tools and templates to get started with AI implementation.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell us about your project</h2>
                  
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Your full name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="your.email@company.com"
                    />
                  </div>

                  {/* Business Name */}
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Your company name"
                    />
                  </div>

                  {/* Project Nature */}
                  <div>
                    <label htmlFor="projectNature" className="block text-sm font-medium text-gray-700 mb-2">
                      What are you looking to implement? *
                    </label>
                    <textarea
                      id="projectNature"
                      name="projectNature"
                      value={formData.projectNature}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                      placeholder="Describe the AI solution or automation you're looking to implement..."
                    />
                  </div>

                  {/* Budget */}
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                      Project Budget *
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    >
                      <option value="">Select your budget range</option>
                      <option value="under-5k">Under $5k</option>
                      <option value="5k-10k">$5k - $10k</option>
                      <option value="10k-20k">$10k - $20k</option>
                      <option value="20k-50k">$20k - $50k</option>
                      <option value="50k-100k">$50k - $100k</option>
                      <option value="100k-plus">$100k+</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-gradient disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        'Join the Waiting List'
                      )}
                    </button>
                  </div>

                  {submitStatus === 'error' && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600">Something went wrong. Please try again.</p>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mastermind Promotion Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            The Next Best Thing
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
            While you wait for our services, join the Applied AI Mastermind community. 
            Get immediate access to curated tools, templates, and a community of 
            professionals implementing AI in real businesses.
          </p>
          <a
            href="https://www.skool.com/applied-ai-mastermind-9612"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gradient"
          >
            Join the Mastermind
          </a>
        </div>
      </section>
    </div>
  )
}
