// TEMPORARY MAINTENANCE MODE - Remove this block to restore normal functionality
import dynamic from 'next/dynamic'
// const NewsList = dynamic(() => import('@/components/NewsList'), { ssr: false })

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Latest AI News</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Stay updated with the latest developments in artificial intelligence, 
          machine learning, and emerging technologies.
        </p>
      </div>
      
      {/* TEMPORARY MAINTENANCE MESSAGE */}
      <div className="text-center py-16">
        <div className="inline-block p-8 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">🔧 We're Tinkering Under the Hood</h2>
          <p className="text-lg text-gray-700 mb-2">
            Our news feed is currently taking a coffee break ☕
          </p>
          <p className="text-base text-gray-600">
            We'll be back shortly with fresh AI updates!
          </p>
        </div>
      </div>
      
      {/* ORIGINAL CODE - Uncomment to restore */}
      {/* <NewsList /> */}
    </div>
  )
}
