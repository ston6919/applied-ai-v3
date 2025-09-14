import ToolsList from '@/components/ToolsList'

export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Tools & Resources</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover powerful AI tools and resources to enhance your productivity 
          and streamline your workflows.
        </p>
      </div>
      <ToolsList />
    </div>
  )
}
