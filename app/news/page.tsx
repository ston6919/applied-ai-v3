import NewsList from '@/components/NewsList'

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Latest AI News</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Stay updated with the latest developments in artificial intelligence, 
          machine learning, and emerging technologies.
        </p>
      </div>
      <NewsList />
    </div>
  )
}
