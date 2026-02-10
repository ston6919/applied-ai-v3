'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'

interface LandingPageData {
  id: number
  title: string
  slug: string
  description: string
  template_content: string
  is_active: boolean
  created_at: string
}

interface SubmissionData {
  email: string
  first_name: string
  business_type: string
}

interface LandingPageContentProps {
  initialData: LandingPageData
}

export default function LandingPageContent({ initialData }: LandingPageContentProps) {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [landingPage] = useState<LandingPageData>(initialData)
  const [currentStep, setCurrentStep] = useState<'email' | 'name' | 'business_type' | 'complete'>('email')
  const [formData, setFormData] = useState<SubmissionData>({
    email: '',
    first_name: '',
    business_type: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submittingButton, setSubmittingButton] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (step: string, data: Partial<SubmissionData>, buttonId?: string) => {
    setSubmitting(true)
    setSubmittingButton(buttonId || null)
    setSubmitError(null)

    try {
      const response = await fetch(`/api/landing-pages/${slug}/submit/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step,
          ...data
        })
      })

      // Safely handle both JSON and non-JSON error responses
      let result: any = null
      let fallbackText: string | null = null

      try {
        const contentType = response.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          result = await response.json()
        } else {
          fallbackText = await response.text()
        }
      } catch (parseError) {
        console.error('Error parsing landing page response:', parseError)
      }

      if (!response.ok) {
        const message =
          (result && result.error) ||
          fallbackText ||
          'Something went wrong submitting your details. Please try again.'
        throw new Error(message)
      }

      // Update form data
      setFormData(prev => ({ ...prev, ...data }))

      // Move to next step (only if we received structured JSON)
      if (result) {
        if (result.next_step) {
          setCurrentStep(result.next_step as any)
        } else if (result.completed) {
          setCurrentStep('complete')
        }

        // After answering the business type question, send people to the mastermind offer page
        if (step === 'business_type') {
          router.push('/offer/mastermind')
        }
      }

    } catch (err: any) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
      setSubmittingButton(null)
    }
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.email && formData.first_name) {
      handleSubmit('email', { email: formData.email, first_name: formData.first_name })
    }
  }

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.first_name) {
      handleSubmit('name', { first_name: formData.first_name })
    }
  }

  const handleBusinessTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.business_type) {
      handleSubmit('business_type', { business_type: formData.business_type })
    }
  }

  return (
    <div className="bg-white flex items-center justify-center px-8 py-12 relative rounded-lg">
      <div className="max-w-md w-full text-center">
        {/* Profile Picture - positioned mostly outside the white background */}
        <div className="mb-8 -mt-20">
          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden relative z-10">
            <Image 
              src="/profile.png" 
              alt="Profile" 
              width={88}
              height={88}
              className="object-cover"
              priority
              onError={(e) => {
                // Fallback to placeholder if image doesn't exist
                e.currentTarget.style.display = 'none'
                const nextSibling = e.currentTarget.nextElementSibling as HTMLElement
                if (nextSibling) {
                  nextSibling.style.display = 'flex'
                }
              }}
            />
            <div className="w-full h-full bg-gray-200 flex items-center justify-center absolute inset-0" style={{display: 'none'}}>
              <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Main Heading - changes based on step */}
        {currentStep === 'email' ? (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {landingPage.title}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {landingPage.description}
            </p>
          </>
        ) : currentStep === 'complete' ? (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              It's on its way!
            </h1>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              It's on its way!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Another question for you:
            </p>
          </>
        )}

        {/* Form Card */}
        <div>
          {currentStep === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <p className="text-gray-500 text-sm mb-4">
                What's your best email address for me to send this to?
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your first name"
                  required
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                  required
                />
                <button
                  type="submit"
                  disabled={submitting || !formData.email || !formData.first_name}
                  className="w-full px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send To Me Now
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-400">
                No spam, ever. Unsubscribe anytime.
              </p>
            </form>
          )}

          {currentStep === 'name' && (
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <p className="text-gray-500 text-sm mb-4">
                What's your first name?
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your first name"
                  required
                />
                <button
                  type="submit"
                  disabled={submitting || !formData.first_name}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Continue
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </form>
          )}

          {currentStep === 'business_type' && (
            <div className="space-y-4">
              <p className="text-gray-700 text-lg font-medium mb-6">
                Are you looking to implement this in your business or sell AI services to other businesses?
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => handleSubmit('business_type', { business_type: 'implement', email: formData.email }, 'implement')}
                  disabled={submitting}
                  className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {submitting && submittingButton === 'implement' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    'Implement in my business'
                  )}
                </button>
                <button
                  onClick={() => handleSubmit('business_type', { business_type: 'sell_services', email: formData.email }, 'sell_services')}
                  disabled={submitting}
                  className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {submitting && submittingButton === 'sell_services' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    'Sell AI services to other businesses'
                  )}
                </button>
              </div>
            </div>
          )}

          {currentStep === 'complete' && (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Thank You, {formData.first_name}!
              </h2>
              {landingPage.template_content && landingPage.template_content.trim() ? (
                <>
                  <p className="text-gray-600 mb-6">
                    Your template is ready. Check your email for the download link.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 text-left">
                    <h3 className="font-semibold text-gray-900 mb-3">Your Template:</h3>
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-gray-700 text-sm">{landingPage.template_content}</pre>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-6">
                    Go and check your emails and find the email from me.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Check Your Email</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Look for an email from me with your template attached.
                    </p>
                    <p className="text-gray-500 text-xs">
                      Don't forget to check your spam folder too!
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {submitError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{submitError}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
